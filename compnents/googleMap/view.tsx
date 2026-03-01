import React from "react";
import { View, Text } from "react-native";

const GoogleMapView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: "#0073E6",
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <Text style={{ color: "white", fontWeight: "bold" }}>
            Map Preview (Native Only)
        </Text>
    </View>
);

export default GoogleMapView;