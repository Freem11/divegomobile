import React, { useState } from "react";
import { Button, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

// --- CONFIGURATION ---
const AUTH0_DOMAIN = "dev-fjzz0qfk4z8eu1gz.us.auth0.com";
const AUTH0_CLIENT_ID = "E7bHuxEuoLVf8XzJXkLBfzUD1MNdnuZa";
const SCHEME_NAME = "scubaseasons";

// Log this and ensure it's in your Auth0 "Allowed Callback URLs"
const REDIRECT_URI = makeRedirectUri({
    scheme: SCHEME_NAME,
    path: "oauthredirect"
});

export default function SuuntoLoginButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const discovery = {
        authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
        tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
    };

    // Note: Switched responseType to "code" for a standard Authorization Code Flow
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: AUTH0_CLIENT_ID,
            responseType: "code",
            extraParams: {
                connection: "Suunto",
                access_type: "offline" // Requests a refresh_token
            },
            scopes: ["openid", "profile", "workout", "offline_access"],
            redirectUri: REDIRECT_URI,
        },
        discovery
    );

    const handleConnectSuunto = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await promptAsync();

            if (result.type === "success") {
                const { code } = result.params;

                // 1. Exchange the code for Suunto/Auth0 tokens
                const tokenResponse = await exchangeCodeAsync(
                    {
                        code,
                        clientId: AUTH0_CLIENT_ID,
                        redirectUri: REDIRECT_URI,
                        extraParams: {
                            code_verifier: request?.codeVerifier || "",
                        },
                    },
                    discovery
                );

                console.log("Token Response:", tokenResponse);
                // 2. Store the Access Token (to call Suunto API)
                // and Refresh Token (to get new access tokens later)
                await SecureStore.setItemAsync("suunto_access_token", tokenResponse.accessToken);
                if (tokenResponse.refreshToken) {
                    await SecureStore.setItemAsync("suunto_refresh_token", tokenResponse.refreshToken);
                }

                console.log("✅ Suunto tokens stored. You can now fetch workouts!");
            }
        } catch (e: any) {
            console.error("Connection Error:", e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : (
                <Button
                    title="Connect Suunto Account"
                    onPress={handleConnectSuunto}
                    disabled={!request}
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