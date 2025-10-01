import React from "react";

import * as S from "./styles";
import GoogleMap from "../googleMap";
import BottomDrawer from "../screens/bottomDrawer/animatedBottomDrawer";
import SearchTool from "../searchTool";
import {
    StyleSheet,
    Platform,
    Dimensions,
} from "react-native";
import { useMapStore } from "../googleMap/useMapStore";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabRoutes } from "./bottomTabNavigator";
import ButtonIcon from "../reusables/buttonIcon-new";
import { getCurrentCoordinates } from "../tutorial/locationTrackingRegistry";

type HomeScreenNavigationProp = BottomTabNavigationProp<
    BottomTabRoutes,
    "Home"
>;

export default function HomeScreen() {
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
                    <BottomDrawer />
                </S.SafeAreaBottom>
            )
                : null}

        </S.Container>
    );
}