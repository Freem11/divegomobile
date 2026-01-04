import React, { useCallback, useRef } from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { useMapStore } from "../../googleMap/useMapStore";
import Center from "../../png/Beach.jpg";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { BottomTabRoutes } from "../../mapPage/bottomTabNavigator";
import { MapConfigurations } from "../../googleMap/types";

import ShopListPage from ".";

type ShopListParallaxNavigationProp = BottomTabNavigationProp<
  BottomTabRoutes,
  "Itinerary"
>;

export default function ShopListParallax() {
  const { t } = useTranslation();
  const drawerRef = useRef<ParallaxDrawerHandle>(null);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const navigation = useNavigation<ShopListParallaxNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      return () => {
        drawerRef.current?.close(null, false);
      };
    }, [])
  );

  const onClose = async () => {
    navigation.goBack();
  };

  const onNavigate = async () => {
    Keyboard.dismiss();
    setMapConfig(MapConfigurations.TripBuild, { pageName: "Diveshop", itemId: 0 });
  };

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={Center}
      onClose={onClose}
      onMapFlip={onNavigate}
    >
      <ShopListPage />

    </ParallaxDrawer>
  );
}
