import { Buffer } from "buffer";

import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, Text, ActivityIndicator, Dimensions } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system/legacy";
import FitParser from "fit-file-parser";
// 💡 1. Import LineChart and Dimensions
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
    // 💡 1. Get the refresh token from the profile
    const suuntoRefreshToken = userProfile?.suunto_refresh_token;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // 💡 New State for Chart Data
    const [chartData, setChartData] = useState<any>(null);

    const discovery = {
        authorizationEndpoint: "https://cloudapi-oauth.suunto.com/oauth/authorize",
        tokenEndpoint: "https://cloudapi-oauth.suunto.com/oauth/token",
    };

    // 💡 2. Attempt to auto-refresh on mount if token exists
    useEffect(() => {
        if (suuntoRefreshToken && !accessToken) {
            refreshAccessToken(suuntoRefreshToken);
        }
    }, [suuntoRefreshToken]);

    const refreshAccessToken = async (refreshToken: string) => {
        setIsLoading(true);
        console.log("Attempting to refresh token...");

        try {
            const tokenData = await performTokenRequest({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            });

            setAccessToken(tokenData.access_token);
            // Update DB if a new refresh token was issued
            if (tokenData.refresh_token && tokenData.refresh_token !== refreshToken) {
                updateSuuntoToken(tokenData.refresh_token);
            }
            console.log("✅ Access token refreshed successfully.");
        } catch (e) {
            console.error("Refresh failed", e);
            // If refresh fails, user needs to re-auth
            setAccessToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to perform the actual fetch request to Suunto
    const performTokenRequest = async (params: Record<string, string>) => {
        const clientId = SUUNTO_CLIENT_ID?.trim();
        const clientSecret = SUUNTO_CLIENT_SECRET?.trim();
        const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(discovery.tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${base64Credentials}`,
            },
            body: new URLSearchParams(params).toString(),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const tokenData = await response.json();
        if (!response.ok) {
            throw new Error(tokenData.error_description || "Token request failed");
        }
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
                if (!code) {
                    console.error("Code not found in URL:", result.url);
                    throw new Error("Authorization failed: No code provided by Suunto.");
                }

                const tokenData = await performTokenRequest({
                    grant_type: "authorization_code",
                    code: code as string,
                    redirect_uri: REDIRECT_URI,
                });

                updateSuuntoToken({ userId: userProfile.UserID, suunto_refresh_token: tokenData.refresh_token });
                setAccessToken(tokenData.access_token);
            } else {
                throw new Error("Authorization session failed or was cancelled.");
            }
        } catch (e: any) {
            console.error("Connect Error:", e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportWorkouts = async () => {
        if (!accessToken) return;
        setIsLoading(true);
        setError(null);
        console.log("Importing workout summary...");

        try {
            // 💡 1. Fetch the summary to get the workoutKey
            const extensions = "SummaryExtension";
            const summaryUrl = `https://cloudapi.suunto.com/v3/workouts?limit=1&sort=desc&extensions=${extensions}`;

            const response = await fetch(summaryUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Ocp-Apim-Subscription-Key": SUUNTO_PRIMARY_API_KEY!,
                },
            });

            const workoutData = await response.json();

            if (!workoutData.payload || workoutData.payload.length === 0) {
                throw new Error("No workouts found.");
            }

            const workoutKey = workoutData.payload[0].workoutKey;
            console.log("Workout Key retrieved:", workoutKey);

            // 💡 2. Download the FIT file using the KEY
            console.log("Downloading FIT file...");
            const fitFileUrl = `https://cloudapi.suunto.com/v3/workouts/${workoutKey}/fit`;
            const fileUri = FileSystem.cacheDirectory + `workout_${workoutKey}.fit`;

            const downloadResult = await FileSystem.downloadAsync(fitFileUrl, fileUri, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Ocp-Apim-Subscription-Key": SUUNTO_PRIMARY_API_KEY!,
                },
            });

            console.log("FIT File downloaded to:", downloadResult.uri);

            // 💡 3. Parse the downloaded FIT file
            console.log("Parsing FIT file...");
            const fileContent = await FileSystem.readAsStringAsync(downloadResult.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const buffer = Buffer.from(fileContent, "base64");
            const parser = new FitParser({
                force: true,
                speedUnit: "m/s",
                lengthUnit: "m",
                temperatureUnit: "celsius",
                elapsedRecordField: true,
                mode: "list",
            });

            parser.parse(buffer, (error: any, data: any) => {
                if (error) {
                    console.error("Parsing Error:", error);
                    setError("Failed to parse FIT file.");
                    return;
                }

                // 💡 4. Map the records to create chart data
                const records = data.records;

                // 💡 INVERT DEPTH: Multiply by -1 to plot downwards
                const depths = records.map((record: any) => (record.depth / 1000) * -1);

                // Create array of timestamps for labels
                const labels = records
                    .filter((_: any, index: number) => index % Math.floor(records.length / 5) === 0)
                    .map((record: any) => {
                        const date = new Date(record.timestamp);
                        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
                    });

                // 💡 5. Prepare the data object for react-native-chart-kit
                const mappedData = {
                    labels: labels,
                    datasets: [
                        {
                            data: depths,
                            // Line and Fill Color to #1E70FE
                            color: (opacity = 1) => `rgba(30, 112, 254, ${opacity})`,
                            strokeWidth: 2,
                            fillShadowGradient: "#1E70FE",
                            fillShadowGradientOpacity: 0.3,
                        },
                    ],
                };

                // 💡 7. LOG & COMPRESS: Create JSON blob for DB
                const dbSeries = records.map((record: any) => ({
                    timestamp_ms: new Date(record.timestamp).getTime(),
                    depth_meters: record.depth / 1000,
                    temperature_c: record.temperature,
                }));

                const jsonBlob = JSON.stringify(dbSeries);

                const workoutCacheObject = {
                    workoutId: workoutKey,
                    data_blob: jsonBlob, // 💡 Compresssed data string
                };

                console.log("JSON Blob size (chars):", jsonBlob.length);
                console.log("Ready to insert:", workoutCacheObject);

                console.log("Mapped Chart Data prepared.");
                setChartData(mappedData);
                alert("Data parsed, compressed into blob, and mapped for plotting!");
            });

        } catch (e: any) {
            console.error("Import Error:", e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : accessToken ? (
                <Button title="Import Suunto Workouts" onPress={handleImportWorkouts} />
            ) : (
                <Button title="Connect Suunto" onPress={handleConnectSuunto} />
            )}
            {error && <Text style={styles.error}>Error: {error}</Text>}

            {chartData && (
                <View style={styles.chartContainer}>
                    <LineChart
                        data={chartData}
                        width={Dimensions.get("window").width - 20}
                        height={250}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                            // 💡 1. Adjust Padding via Config Style
                            style: {
                                paddingRight: 100, // Increase right padding
                                paddingLeft: -100,   // Reduce left padding
                            },

                            propsForBackgroundLines: {
                                strokeDasharray: "",
                                stroke: "rgba(255, 255, 255, 0.1)",
                            },
                            propsForDots: {
                                r: "0",
                                strokeWidth: "0",
                            }
                        }}
                        withLegend={false}
                        bezier
                        withShadow={true}

                        // 💡 2. Adjust chart props for tighter control
                        style={styles.chart}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5" },
    error: { color: "red", marginTop: 10, textAlign: "center" },
    // 💡 3. Chart Styles
    chartContainer: { marginTop: 20, borderRadius: 16, overflow: "hidden" },
    chart: {
        marginVertical: 8,
    },
});