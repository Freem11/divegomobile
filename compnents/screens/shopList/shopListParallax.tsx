import React, { useContext } from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { useMapStore } from "../../googleMap/useMapStore";
import Center from "../../png/Beach.jpg";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { BottomTabRoutes } from "../../mapPage/bottomTabNavigator";
import { MapConfigurations } from "../../googleMap/types";

import ShopListPage from ".";

type ShopListParallaxNavigationProp = BottomTabNavigationProp<
  BottomTabRoutes,
  "Itinerary"
>;

export default function ShopListParallax() {
  const { t } = useTranslation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const navigation = useNavigation<ShopListParallaxNavigationProp>();
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const onClose = async () => {
    navigation.goBack();
  };

  const onNavigate = async () => {
    Keyboard.dismiss();
    setMapConfig(MapConfigurations.TripBuild, { pageName: "Diveshop", itemId: 0 });
    setLevelOneScreen(false);
  };

  return (
    <ParallaxDrawer
      headerImage={Center}
      onClose={onClose}
      onMapFlip={onNavigate}
    >
      <ShopListPage />

    </ParallaxDrawer>
  );
}
