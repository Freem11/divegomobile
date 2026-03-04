import { Buffer } from "buffer";

import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, Text, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system/legacy";
import FitParser from "fit-file-parser";
import { LineChart } from "react-native-chart-kit";

import { updateSuuntoToken } from "../../../supabaseCalls/accountSupabaseCalls";
import { useUserProfile } from "../../../store/user/useUserProfile";

// --- SUUNTO CONFIGURATION ---
const SUUNTO_CLIENT_ID = process.env.EXPO_PUBLIC_SUUNTO_CLIENT_ID;
const SUUNTO_CLIENT_SECRET = process.env.EXPO_PUBLIC_SUUNTO_CLIENT_SECRET;
const REDIRECT_URI = "https://lsakqvscxozherlpunqx.supabase.co/functions/v1/suunto-redirect";
const SUUNTO_PRIMARY_API_KEY = process.env.EXPO_PUBLIC_SUUNTO_PRIMARY_API_KEY;

export default function SuuntoConnectButton() {
    useEffect(() => {
        WebBrowser.maybeCompleteAuthSession();
    }, []);

    const { userProfile } = useUserProfile();
    const suuntoRefreshToken = userProfile?.suunto_refresh_token;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // 💡 Store an array of Dive Log objects
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
                updateSuuntoToken(tokenData.refresh_token);
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
                updateSuuntoToken({ userId: userProfile.UserID, suunto_refresh_token: tokenData.refresh_token });
                setAccessToken(tokenData.access_token);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 💡 Promise wrapper for FitParser
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

    const handleImportWorkouts = async () => {
        if (!accessToken) return;
        setIsLoading(true);
        setError(null);
        setDiveLogs([]);

        try {
            // 💡 Fetch last 5 workouts
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

            const logsTemp: any[] = [];

            // 💡 Loop through each workout payload
            for (const payload of workoutData.payload) {
                const workoutKey = payload.workoutKey;
                const diveHeader = payload.extensions?.find((ext: any) => ext.type === "DiveHeaderExtension");
                const summaryExt = payload.extensions?.find((ext: any) => ext.gear);

                // Convert Kelvin to Celsius
                const maxTempC = diveHeader?.maxDepthTemperature ? parseFloat((diveHeader.maxDepthTemperature - 273.15).toFixed(1)) : null;

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
                const records = data.records;

                // Prepare Chart Data
                const depths = records.map((record: any) => (record.depth / 1000) * -1);
                const labels = records
                    .filter((_: any, index: number) => index % Math.floor(records.length / 5) === 0)
                    .map((record: any) => {
                        const date = new Date(record.timestamp);
                        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
                    });

                const dbSeries = records.map((record: any) => ({
                    timestamp_ms: new Date(record.timestamp).getTime(),
                    depth_meters: record.depth / 1000,
                    temperature_c: record.temperature,
                }));

                // 💡 Construct the object with keys you requested
                logsTemp.push({
                    workoutId: workoutKey,
                    rawStartTime: new Date(payload.startTime), // Used for sorting
                    startTime: new Date(payload.startTime).toLocaleDateString(),
                    maxDepth: diveHeader?.maxDepth || 0,
                    avgDepth: diveHeader?.avgDepth || 0,
                    maxTemp: maxTempC,
                    diveTimeSeconds: diveHeader?.diveTime || payload.totalTime,
                    diveMode: diveHeader?.diveMode || "Unknown",
                    deviceName: summaryExt?.gear?.name || "Suunto Device",
                    chartConfig: {
                        labels: labels,
                        datasets: [{
                            data: depths,
                            color: (opacity = 1) => `rgba(30, 112, 254, ${opacity})`,
                            strokeWidth: 2,
                            fillShadowGradient: "#1E70FE",
                            fillShadowGradientOpacity: 0.3,
                        }],
                    },
                    streamData: JSON.stringify(dbSeries), // Last key as requested
                });
            }

            // 💡 Sort: Newest (Top) to Oldest (Bottom)
            logsTemp.sort((a, b) => b.rawStartTime.getTime() - a.rawStartTime.getTime());

            setDiveLogs(logsTemp);
            alert(`Successfully imported ${logsTemp.length} dives!`);

        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : accessToken ? (
                    <Button title="Import Last 5 Suunto Workouts" onPress={handleImportWorkouts} />
                ) : (
                    <Button title="Connect Suunto" onPress={handleConnectSuunto} />
                )}
                {error && <Text style={styles.error}>Error: {error}</Text>}
            </View>

            {/* Render a chart and summary for each dive log */}
            {diveLogs.map((log) => (
                <View key={log.workoutId} style={styles.chartContainer}>
                    <Text style={styles.cardTitle}>{log.startTime} - {log.diveMode}</Text>
                    <Text style={styles.cardSub}>Max Depth: {log.maxDepth}m | Temp: {log.maxTemp}°C</Text>

                    <LineChart
                        data={log.chartConfig}
                        width={Dimensions.get("window").width - 40}
                        height={200}
                        yAxisSuffix="m"
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            propsForBackgroundLines: { strokeDasharray: "", stroke: "rgba(0, 0, 0, 0.05)" },
                            propsForDots: { r: "0" }
                        }}
                        formatYLabel={(label) => Math.abs(parseFloat(label)).toString()}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        bezier
                        style={styles.chart}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingVertical: 40, paddingHorizontal: 15, backgroundColor: "#f5f5f5" },
    header: { alignItems: "center", marginBottom: 20 },
    error: { color: "red", marginTop: 10, textAlign: "center" },
    chartContainer: {
        marginBottom: 20,
        borderRadius: 16,
        backgroundColor: "#fff",
        padding: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
    cardSub: { fontSize: 14, color: "#666", marginBottom: 10 },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});