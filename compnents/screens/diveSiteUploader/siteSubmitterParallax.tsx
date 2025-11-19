import React, { useContext } from "react";
import { Keyboard } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import boatImage from "../../png/boat.png";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { useMapStore } from "../../googleMap/useMapStore";
import { ScreenReturn } from "../../googleMap/types";
import { BottomTabRoutes } from "../../mapPage/bottomTabNavigator";
import { calculateRegionFromBoundaries } from "../../googleMap/regionCalculator";
import { useAppNavigation } from "../../mapPage/types";

import DiveSiteUploader from ".";

type SiteSubmitterParallaxNavigationProp = BottomTabNavigationProp<
  BottomTabRoutes,
  "AddSite"
>;

export default function SiteSubmitterParallax() {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setDraggableConfig = useMapStore((state) => state.actions.setDraggablePoint);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);

  const navigation = useNavigation<SiteSubmitterParallaxNavigationProp>();
  const appNavigation = useAppNavigation();
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);
  const mapRef = useMapStore((state) => state.mapRef);

  const onClose = async () => {
    setFormValues({
      Site: "",
      Latitude: null,
      Longitude: null
    });
    setDraggableConfig(null);
    navigation.goBack();
  };

  const onNavigate = async () => {
    Keyboard.dismiss();
    if (mapRef) {
      const region = await calculateRegionFromBoundaries(mapRef);
      setMapRegion(region);

      setMapConfig(1, { pageName: ScreenReturn.SiteSubmitter as unknown as string, itemId: 1 });
      appNavigation.navigate("GoogleMap");
    }
  };

  return (
    <ParallaxDrawer headerImage={boatImage} onClose={onClose} onMapFlip={onNavigate}>
      <DiveSiteUploader />
    </ParallaxDrawer>
  );
}
