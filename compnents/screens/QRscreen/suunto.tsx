import { Buffer } from "buffer";

import React, { useState, useEffect } from "react";
import {
    Button,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Alert
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system/legacy";
import FitParser from "fit-file-parser";
import { LineChart } from "react-native-chart-kit";
import LZString from "lz-string";

// Internal Imports
import { supabase } from "../../../supabase";
import { updateSuuntoToken } from "../../../supabaseCalls/accountSupabaseCalls";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { DIVE_LOG_VENDORS } from "../../../entities/vendors";

const SUUNTO_CLIENT_ID = process.env.EXPO_PUBLIC_SUUNTO_CLIENT_ID;
const SUUNTO_CLIENT_SECRET = process.env.EXPO_PUBLIC_SUUNTO_CLIENT_SECRET;
const REDIRECT_URI = "https://lsakqvscxozherlpunqx.supabase.co/functions/v1/suunto-redirect";
const SUUNTO_PRIMARY_API_KEY = process.env.EXPO_PUBLIC_SUUNTO_PRIMARY_API_KEY;

export default function SuuntoConnectButton() {
    useEffect(() => {
        WebBrowser.maybeCompleteAuthSession();
    }, []);

    const { userProfile } = useUserProfile();
    const currentUserId = userProfile?.UserID;
    const suuntoRefreshToken = userProfile?.suunto_refresh_token;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [diveLogs, setDiveLogs] = useState<any[]>([]);

    const discovery = {
        authorizationEndpoint: "https://cloudapi-oauth.suunto.com/oauth/authorize",
        tokenEndpoint: "https://cloudapi-oauth.suunto.com/oauth/token",
    };

    useEffect(() => {
        if (suuntoRefreshToken && !accessToken) {
            refreshAccessToken(suuntoRefreshToken);
        }
    }, [suuntoRefreshToken]);

    const refreshAccessToken = async (refreshToken: string) => {
        setIsLoading(true);
        try {
            const tokenData = await performTokenRequest({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            });
            setAccessToken(tokenData.access_token);
            if (tokenData.refresh_token && tokenData.refresh_token !== refreshToken) {
                updateSuuntoToken({ userId: currentUserId, suunto_refresh_token: tokenData.refresh_token });
            }
        } catch (e) {
            console.error("Refresh failed", e);
            setAccessToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const performTokenRequest = async (params: Record<string, string>) => {
        const clientId = SUUNTO_CLIENT_ID?.trim();
        const clientSecret = SUUNTO_CLIENT_SECRET?.trim();
        const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        const response = await fetch(discovery.tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${base64Credentials}`,
            },
            body: new URLSearchParams(params).toString(),
        });

        const tokenData = await response.json();
        if (!response.ok) throw new Error(tokenData.error_description || "Token request failed");
        return tokenData;
    };

    const handleConnectSuunto = async () => {
        setIsLoading(true);
        setError(null);
        const authUrl = `${discovery.authorizationEndpoint}?` + new URLSearchParams({
            client_id: SUUNTO_CLIENT_ID!,
            response_type: "code",
            redirect_uri: REDIRECT_URI,
            scope: "workout",
        }).toString();

        try {
            const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
            if (result.type === "success") {
                const code = Linking.parse(result.url).queryParams?.code;
                const tokenData = await performTokenRequest({
                    grant_type: "authorization_code",
                    code: code as string,
                    redirect_uri: REDIRECT_URI,
                });
                updateSuuntoToken({ userId: currentUserId, suunto_refresh_token: tokenData.refresh_token });
                setAccessToken(tokenData.access_token);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const parseFitFile = (buffer: Buffer): Promise<any> => {
        return new Promise((resolve, reject) => {
            const parser = new FitParser({
                force: true,
                speedUnit: "m/s",
                lengthUnit: "m",
                temperatureUnit: "celsius",
                elapsedRecordField: true,
                mode: "list"
            });
            parser.parse(buffer, (err, data) => (err ? reject(err) : resolve(data)));
        });
    };

    /**
           * SYNC TO SUPABASE
           * Splits UI data from DB data and upserts to your universal table.
           */
    const syncDivesToSupabase = async (logs: any[]) => {
        // We strip the UI-specific chartConfig before sending to Supabase
        const dbReadyLogs = logs.map(({ chartConfig, startTimeDisplay, ...dbData }) => dbData);

        const { error } = await supabase
            .from("dive_logs")
            .upsert(dbReadyLogs, { onConflict: "user_id, external_id" });

        if (error) {
            console.error("Supabase Sync Error:", error);
            throw new Error("Failed to save to database.");
        }
    };

    const handleImportWorkouts = async () => {
        if (!accessToken || !currentUserId) {
            Alert.alert("Error", "User not authenticated or profile missing.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const summaryUrl = "https://cloudapi.suunto.com/v3/workouts?limit=5&sort=desc&extensions=SummaryExtension";
            const response = await fetch(summaryUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Ocp-Apim-Subscription-Key": SUUNTO_PRIMARY_API_KEY!,
                },
            });

            const workoutData = await response.json();
            if (!workoutData.payload || workoutData.payload.length === 0) throw new Error("No workouts found.");

            const processedLogs: any[] = [];

            for (const payload of workoutData.payload) {
                const workoutKey = payload.workoutKey;
                const diveHeader = payload.extensions?.find((ext: any) => ext.type === "DiveHeaderExtension");
                const summaryExt = payload.extensions?.find((ext: any) => ext.gear);

                // Temp Kelvin to Celsius
                const maxTempC = diveHeader?.maxDepthTemperature ? parseFloat((diveHeader.maxDepthTemperature - 273.15).toFixed(1)) : null;

                // Download FIT
                const fitFileUrl = `https://cloudapi.suunto.com/v3/workouts/${workoutKey}/fit`;
                const fileUri = FileSystem.cacheDirectory + `workout_${workoutKey}.fit`;

                const downloadResult = await FileSystem.downloadAsync(fitFileUrl, fileUri, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Ocp-Apim-Subscription-Key": SUUNTO_PRIMARY_API_KEY!,
                    },
                });

                const fileContent = await FileSystem.readAsStringAsync(downloadResult.uri, { encoding: FileSystem.EncodingType.Base64 });
                const buffer = Buffer.from(fileContent, "base64");
                const data = await parseFitFile(buffer);
                const records = data.records || [];

                // 💡 COMPRESSION: Time/Depth/Temp stream
                const dbSeries = records.map((r: any) => ({
                    ts: new Date(r.timestamp).getTime(),
                    d: r.depth / 1000,
                    t: r.temperature,
                }));
                const compressedStream = LZString.compressToUTF16(JSON.stringify(dbSeries));

                // 💡 Build the Universal Record
                processedLogs.push({
                    user_id: currentUserId,
                    external_id: workoutKey,
                    source: DIVE_LOG_VENDORS.SUUNTO,
                    start_time: new Date(payload.startTime).toISOString(),
                    dive_mode: diveHeader?.diveMode || "Unknown",
                    device_name: summaryExt?.gear?.name || "Suunto Device",
                    max_depth: diveHeader?.maxDepth || 0,
                    avg_depth: diveHeader?.avgDepth || 0,
                    max_temp: maxTempC,
                    dive_time: diveHeader?.diveTime || payload.totalTime,
                    stream_data: compressedStream,

                    // Fields for UI rendering in this screen
                    startTimeDisplay: new Date(payload.startTime).toLocaleDateString(),
                    chartConfig: {
                        labels: records
                            .filter((_: any, index: number) => index % Math.floor(records.length / 5) === 0)
                            .map((r: any) => {
                                const d = new Date(r.timestamp);
                                return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
                            }),
                        datasets: [{
                            data: records.map((r: any) => (r.depth / 1000) * -1),
                            color: (opacity = 1) => `rgba(30, 112, 254, ${opacity})`,
                            strokeWidth: 2
                        }],
                    },
                });
            }

            processedLogs.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

            // 🔥 AUTOMATED SYNC
            await syncDivesToSupabase(processedLogs);

            setDiveLogs(processedLogs);
            Alert.alert("Success", `Imported and synced ${processedLogs.length} dives.`);

        } catch (e: any) {
            setError(e.message);
            Alert.alert("Import Failed", e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#1E70FE" />
                ) : accessToken ? (
                    <Button title="Import Recent Dives" onPress={handleImportWorkouts} />
                ) : (
                    <Button title="Connect Suunto Account" onPress={handleConnectSuunto} />
                )}
                {error && <Text style={styles.error}>{error}</Text>}
            </View>

            {diveLogs.map((log) => (
                <View key={log.external_id} style={styles.chartContainer}>
                    <Text style={styles.cardTitle}>{log.startTimeDisplay} - {log.dive_mode}</Text>
                    <Text style={styles.cardSub}>
                        Max: {log.max_depth}m | Temp: {log.max_temp}°C | {Math.floor(log.dive_time / 60)}m
                    </Text>

                    <LineChart
                        data={log.chartConfig}
                        width={Dimensions.get("window").width - 60}
                        height={160}
                        yAxisSuffix="m"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForDots: { r: "0" }
                        }}
                        formatYLabel={(label) => Math.abs(parseFloat(label)).toString()}
                        bezier
                        style={styles.chart}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingVertical: 50, paddingHorizontal: 20, backgroundColor: "#F9FAFB" },
    header: { alignItems: "center", marginBottom: 30 },
    error: { color: "#EF4444", marginTop: 12, fontWeight: "500" },
    chartContainer: {
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        padding: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
    cardSub: { fontSize: 13, color: "#6B7280", marginVertical: 6 },
    chart: { marginVertical: 8, borderRadius: 12 },
});