import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";

import myLogo from "../../../assets/icon.png";
import { colors, fontSizes } from "../../styles";

const { width } = Dimensions.get("window");

const UniversalSync = () => {
    const [serverOffset, setServerOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [now, setNow] = useState<number>(Date.now());

    // 1. Robust Network Sync with Multiple Endpoints
    useEffect(() => {
        const fetchAtomicTime = async () => {
            const apiEndpoints = [
                "https://timeapi.io/api/Time/current/zone?timeZone=UTC",
                "https://worldtimeapi.org/api/timezone/Etc/UTC"
            ];

            for (const url of apiEndpoints) {
                try {
                    const startTime = Date.now();
                    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
                    if (!response.ok) throw new Error("Network error");

                    const data = await response.json();
                    const endTime = Date.now();
                    const latency = (endTime - startTime) / 2;

                    const rawDateString = data.dateTime || data.utc_datetime;
                    const atomicTime = new Date(rawDateString).getTime() + latency;

                    setServerOffset(atomicTime - endTime);
                    setIsLoading(false);
                    console.log(`✅ Synced via ${url}`);
                    return;
                } catch (error) {
                    console.warn(`Failed ${url}:`, error);
                }
            }
            setServerOffset(0); // Fallback to phone clock if offline on the boat
            setIsLoading(false);
        };

        fetchAtomicTime();
    }, []);

    // 2. 1Hz Pulse (Stabilized for GoPro QR scanning)
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now() + serverOffset);
        }, 1000);
        return () => clearInterval(interval);
    }, [serverOffset]);

    // 3. Formatter for GoPro Labs (Scientific 24h format for hardware internal)
    const formatGoProTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const pad = (n: number) => n.toString().padStart(2, "0");

        const yy = date.getUTCFullYear().toString().slice(-2);
        const mm = pad(date.getUTCMonth() + 1);
        const dd = pad(date.getUTCDate());
        const hh = pad(date.getUTCHours());
        const min = pad(date.getUTCMinutes());
        const ss = pad(date.getUTCSeconds());
        const ms = date.getUTCMilliseconds().toString().padStart(3, "0").slice(0, 1);

        return `${yy}${mm}${dd}${hh}${min}${ss}.${ms}`;
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primaryBlue} />
                <Text style={styles.loadingText}>CALIBRATING ATOMIC CLOCK...</Text>
            </View>
        );
    }

    // The QR contains 24h data for GoPro + Unix Timestamp for your scraper
    const qrValue = `oT${formatGoProTime(now)}|UTC:${now}`;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Device Sync</Text>

            <View style={styles.qrWrapper}>
                <QRCode
                    value={qrValue}
                    size={width * 0.75}
                    color="black"
                    backgroundColor="white"
                    logo={myLogo}
                    logoSize={60}
                    logoBackgroundColor="white"
                    logoBorderRadius={10}
                    logoMargin={5}
                    ecl="M"
                />
            </View>

            <View style={styles.displaySection}>
                {/* UTC SECTION with AM/PM */}
                <View style={styles.timeRow}>
                    <View style={[styles.dot, { backgroundColor: colors.greenLight }]} />
                    <Text style={styles.label}>SCIENTIFIC UTC (DATA)</Text>
                </View>
                <Text style={styles.utcClock}>
                    {new Date(now).toLocaleTimeString("en-US", {
                        timeZone: "UTC",
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    })}
                </Text>

                <View style={styles.divider} />

                {/* LOCAL SECTION */}
                <View style={styles.timeRow}>
                    <View style={[styles.dot, { backgroundColor: colors.primaryBlue }]} />
                    <Text style={styles.label}>LOCAL TIME (REFERENCE)</Text>
                </View>
                <Text style={styles.localClock}>
                    {new Date(now).toLocaleTimeString([], {
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    })}
                </Text>
            </View>

            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                    {serverOffset === 0 ? "OFFLINE: PHONE CLOCK" : "NETWORK SYNCED (NTP)"}
                </Text>
            </View>

            {/* GoPro Specific Instruction */}
            <TouchableOpacity
                style={styles.helpButton}
                onPress={() => Linking.openURL("https://gopro.github.io/labs/")}
            >
                <Text style={styles.helpText}>GoPro Users: Tap to setup Labs Sync</Text>
            </TouchableOpacity>
            <Text style={styles.instructionText}>to allow this QR update your GoPro's date & time!</Text>

            {/* Non-GoPro Instruction */}
            <View style={styles.bottomMessage} >
                <Text style={styles.instructionText}>
                    All Other Cameras: Simply take a photo of this QR code and submit with your other photos to sync.
                </Text>
            </View>

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.themeWhite,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    header: {
        color: colors.themeBlack,
        fontSize: 12,
        fontWeight: "800",
        letterSpacing: 4,
        marginBottom: 20,
        textTransform: "uppercase",
        opacity: 0.6
    },
    loadingText: { color: colors.primaryBlue, marginTop: 20, letterSpacing: 1, fontSize: 12 },
    qrWrapper: {
        padding: 15,
        backgroundColor: "white",
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    displaySection: {
        marginTop: 30,
        width: "100%",
        alignItems: "center",
    },
    timeRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    label: { color: "#888", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
    utcClock: {
        color: colors.greenLight,
        fontSize: 32,
        fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
        fontWeight: "700",
    },
    localClock: {
        color: colors.primaryBlue,
        fontSize: 24,
        fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
        fontWeight: "600",
    },
    divider: {
        height: 1,
        width: 40,
        backgroundColor: "#eee",
        marginVertical: 12,
    },
    statusBadge: {
        marginTop: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#f5f5f5",
    },
    statusText: { color: "#999", fontSize: 10, fontWeight: "bold" },
    helpButton: {
        marginTop: 30,
    },
    helpText: {
        color: colors.primaryBlue,
        fontSize: 12,
        textDecorationLine: "underline",
        textAlign: "center"
    },
    bottomMessage: {
        marginTop: 15,
        paddingHorizontal: 20
    },
    instructionText: {
        color: colors.darkGrey || "#666",
        fontSize: 11,
        textAlign: "center",
        lineHeight: 16
    }
});

export default UniversalSync;