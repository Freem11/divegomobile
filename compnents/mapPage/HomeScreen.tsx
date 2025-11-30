import React from "react";
import { StyleSheet } from "react-native";

import GoogleMap from "../googleMap";
import BottomDrawer from "../screens/bottomDrawer/animatedBottomDrawer";
import SearchTool from "../searchTool";
import { useMapStore } from "../googleMap/useMapStore";
import ButtonIcon from "../reusables/buttonIcon-new";
import { getCurrentCoordinates } from "../tutorial/locationTrackingRegistry";

import * as S from "./styles";

export default function HomeScreen() {
    const mapRegion = useMapStore((state) => state.mapRegion);
    const mapConfig = useMapStore((state) => state.mapConfig);
    const mapRef = useMapStore((state) => state.mapRef);

    const getCurrentLocation = async () => {
        try {
            const { coords } = await getCurrentCoordinates();
            if (coords) {
                mapRef?.animateToRegion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 1,
                    longitudeDelta: 1,
                }, 500);
            }
        } catch (e) {
            console.log({ title: "Error", message: e.message });
        }
    };

    return (
        <S.Container>

            <GoogleMap style={StyleSheet.absoluteFillObject} />

            <S.SafeAreaTop edges={["top"]}>
                <SearchTool />
            </S.SafeAreaTop>

            {mapConfig === 0 ? (
                <S.SafeAreaBottom edges={["bottom"]}>
                    <S.TargetWrapper>
                        <ButtonIcon
                            icon="target"
                            size={36}
                            onPress={() => getCurrentLocation()}
                            style={{ pointerEvents: "auto" }}
                        />
                    </S.TargetWrapper>
                    <BottomDrawer mapRegion={mapRegion} mapConfig={mapConfig} />
                </S.SafeAreaBottom>
            )
                : null}

        </S.Container>
    );
}