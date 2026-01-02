import React from "react";
import { StyleSheet, Image } from "react-native";
import { styled } from "styled-components";
import { moderateScale } from "react-native-size-matters";
import { View } from "react-native";

import GoogleMap from "../googleMap";
import BottomDrawer from "../screens/bottomDrawer/animatedBottomDrawer";
import SearchTool from "../searchTool";
import { useMapStore } from "../googleMap/useMapStore";
import ButtonIcon from "../reusables/buttonIcon-new";
import { getCurrentCoordinates } from "../tutorial/locationTrackingRegistry";
import { Explainer } from "../screens/formScreens/explainer";
import { activeFonts } from "../styles";
import { MarkerDiveShop } from "../googleMap/marker/markerDiveShop";
import { MarkerDiveSite } from "../googleMap/marker/markerDiveSite";
import { MarkerDiveSiteCluster } from "../googleMap/marker/markerDiveSiteCluster";
import HeatPoint from "../png/guideIcons/heatpoint.png";

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

    const Bold = styled(S.PopOverText)`
    font-family: ${activeFonts.Medium};
    margin-bottom: ${moderateScale(10)}px;
  `;

    const popoverContent = () => {

        return (
            <S.PopOver>
                <Bold>How to use the map</Bold>

                <View style={{ height: moderateScale(40), alignItems: "center", justifyContent: "center" }}>
                    <MarkerDiveSiteCluster />
                </View>

                <S.PopOverText>
                    The cluster anchor represents groups of dive sites. Tapping it will zoom in until it splits.
                </S.PopOverText>

                <View style={{ height: moderateScale(40), alignItems: "center", justifyContent: "center" }}>
                    <MarkerDiveSite />
                </View>
                <S.PopOverText>
                    The anchor represents a dive site. Tapping it will open that site's page.
                </S.PopOverText>

                <View style={{ height: moderateScale(40), alignItems: "center", justifyContent: "center" }}>
                    <MarkerDiveShop />
                </View>
                <S.PopOverText>
                    The snorkel & roof represents a dive centre. Tapping it will open that centre's page.
                </S.PopOverText>

                <Image
                    source={HeatPoint}
                    style={{
                        width: moderateScale(36),
                        height: moderateScale(36),
                        resizeMode: "contain"
                    }}
                />
                <S.PopOverText>
                    Are heatpoints; they represent sea life sightings. These filter when you search for a creature.
                </S.PopOverText>
            </S.PopOver>
        );
    };

    return (
        <S.Container>

            <GoogleMap style={StyleSheet.absoluteFillObject} />

            {/* <S.SafeAreaTop edges={["top"]}> */}
            <SearchTool />
            {/* </S.SafeAreaTop> */}

            {mapConfig === 0 ? (
                <S.SafeAreaBottom edges={["bottom"]}>
                    <S.PopOverWrapper>
                        <Explainer popoverContent={popoverContent} iconSize={34} />
                    </S.PopOverWrapper>
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