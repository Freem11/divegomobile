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

type HomeScreenNavigationProp = BottomTabNavigationProp<
    BottomTabRoutes,
    "Home"
>;

export default function HomeScreen() {
    const mapConfig = useMapStore((state) => state.mapConfig);

    return (
        <S.Container>

            <GoogleMap style={StyleSheet.absoluteFillObject} />

            <S.SafeAreaTop edges={["top"]}>
                <SearchTool />
            </S.SafeAreaTop>

            {mapConfig === 0 ? (
                <S.SafeAreaBottom edges={["bottom"]}>

                    <BottomDrawer />
                </S.SafeAreaBottom>
            )
                : null}

        </S.Container>
    );
}