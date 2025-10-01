import React, { useContext } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import boatImage from "../../png/boat.png";
import { Keyboard } from "react-native";
import { useMapStore } from "../../googleMap/useMapStore";
import { ScreenReturn } from "../../googleMap/types";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabRoutes } from "../../mapPage/bottomTabNavigator";
import { useNavigation } from "@react-navigation/native";

type SiteSubmitterParallaxNavigationProp = BottomTabNavigationProp<
  BottomTabRoutes,
  "AddSite"
>;

export default function SiteSubmitterParallax() {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setDraggableConfig = useMapStore((state) => state.actions.setDraggablePoint);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);

  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const navigation = useNavigation<SiteSubmitterParallaxNavigationProp>();

  const onClose = async () => {
    setFormValues(null)
    // setLevelTwoScreen(false);
    setDraggableConfig(null)
    navigation.goBack();
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapConfig(1, { pageName: ScreenReturn.SiteSubmitter as unknown as string, itemId: 1 });
    setLevelTwoScreen(false);
  };

  return (
    <ParallaxDrawer headerImage={boatImage} onClose={onClose} onMapFlip={onNavigate}>
      <DiveSiteUploader />
    </ParallaxDrawer>
  );
}
