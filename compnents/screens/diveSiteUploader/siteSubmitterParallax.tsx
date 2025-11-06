import React, { useContext } from "react";
import { Keyboard } from "react-native";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import boatImage from "../../png/boat.png";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { useMapStore } from "../../googleMap/useMapStore";
import { ScreenReturn } from "../../googleMap/types";
import { useAppNavigation } from "../../mapPage/types";
import DiveSiteUploader from ".";

export default function SiteSubmitterParallax() {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setDraggableConfig = useMapStore((state) => state.actions.setDraggablePoint);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);

  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const navigation = useAppNavigation();

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
