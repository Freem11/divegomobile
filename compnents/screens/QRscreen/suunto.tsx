import { Buffer } from "buffer";

import React, { useState, useEffect } from "react";
import { Button, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";

// --- SUUNTO CONFIGURATION ---
// ⚠️ Ensure these are defined in your .env file
const SUUNTO_CLIENT_ID = process.env.EXPO_PUBLIC_SUUNTO_CLIENT_ID;
const SUUNTO_CLIENT_SECRET = process.env.EXPO_PUBLIC_SUUNTO_CLIENT_SECRET;

// 💡 Using the Supabase Edge Function as an HTTPS intermediary
const REDIRECT_URI = "https://lsakqvscxozherlpunqx.supabase.co/functions/v1/suunto-redirect";

export default function SuuntoConnectButton() {
    // 💡 Fix: Call this inside the component to handle the return from the browser
    useEffect(() => {
        WebBrowser.maybeCompleteAuthSession();
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const discovery = {
        authorizationEndpoint: "https://cloudapi-oauth.suunto.com/oauth/authorize",
        tokenEndpoint: "https://cloudapi-oauth.suunto.com/oauth/token",
    };

    const handleConnectSuunto = async () => {
        setIsLoading(true);
        setError(null);

        console.log("Starting Suunto OAuth Flow", SUUNTO_CLIENT_ID);

        // 💡 1. Manually construct the auth URL
        const authUrl = `${discovery.authorizationEndpoint}?` + new URLSearchParams({
            client_id: SUUNTO_CLIENT_ID!,
            response_type: "code",
            redirect_uri: REDIRECT_URI,
            scope: "workout",
        }).toString();

        console.log("made authUrl:", authUrl);

        try {
            // 💡 2. Open browser manually
            const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
            console.log("Auth Result:", result);

            if (result.type === "success") {
                const { url } = result;
                // 💡 3. Parse the 'code' from the returned URL (scubaseasons://?code=...)
                const code = Linking.parse(url).queryParams?.code;

                if (code) {
                    console.log("Code received:", code);
                    await exchangeCodeForTokens(code as string);
                } else {
                    throw new Error("No code found in redirect URL");
                }
            } else {
                throw new Error("Authorization cancelled or failed.");
            }
        } catch (e: any) {
            console.error("Auth Error:", e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const exchangeCodeForTokens = async (code: string) => {
        try {
            console.log("Exchanging Code:", code);

            const clientId = SUUNTO_CLIENT_ID?.trim();
            const clientSecret = SUUNTO_CLIENT_SECRET?.trim();

            if (!clientId || !clientSecret) {
                throw new Error("Missing Client ID or Secret in environment variables");
            }

            const credentials = `${clientId}:${clientSecret}`;
            const base64Credentials = Buffer.from(credentials).toString("base64");

            console.log("Starting network request to Suunto...");

            // 💡 1. Increase timeout to 30 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            // 💡 2. Strictly URL-encode the REDIRECT_URI
            const encodedRedirectUri = encodeURIComponent(REDIRECT_URI);
            const bodyParams = `grant_type=authorization_code&code=${code}&redirect_uri=${encodedRedirectUri}`;

            console.log("FINAL POST BODY:", bodyParams);

            const tokenResponse = await fetch(discovery.tokenEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${base64Credentials}`,
                },
                body: bodyParams,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log("Network request completed, status:", tokenResponse);

            // 💡 3. Always consume the response body, even on error
            const textResponse = await tokenResponse.text();
            let tokenData;
            try {
                tokenData = JSON.parse(textResponse);
            } catch (e) {
                console.error("Failed to parse JSON", textResponse);
                throw new Error("Invalid JSON response from Suunto");
            }

            if (!tokenResponse.ok) {
                console.error("Token Exchange Failed Body:", tokenData);
                throw new Error(`Token exchange failed (${tokenResponse.status}): ${tokenData.error_description || tokenData.error}`);
            }
            console.log("Token exchange successful access token:", tokenData.access_token);
            console.log("Token exchange successful refresh token:", tokenData.refresh_token);
            // 4. Store Tokens securely
            await SecureStore.setItemAsync("suunto_access_token", tokenData.access_token);
            if (tokenData.refresh_token) {
                await SecureStore.setItemAsync("suunto_refresh_token", tokenData.refresh_token);
            }

            console.log("✅ Suunto tokens stored securely.");
        } catch (e: any) {
            console.error("Exchange Error:", e);
            setError(e.message);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : (
                <Button
                    title="Connect Suunto to Pull Workouts"
                    onPress={handleConnectSuunto}
                />
            )}
            {error && <Text style={styles.error}>Error: {error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: "center", justifyContent: "center" },
    error: { color: "red", marginTop: 10, textAlign: "center" },
});