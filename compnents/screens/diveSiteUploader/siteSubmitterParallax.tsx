import React, { useContext } from "react";
import { Keyboard } from "react-native";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import boatImage from "../../png/boat.png";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { useMapStore } from "../../googleMap/useMapStore";
import { ScreenReturn } from "../../googleMap/types";

import DiveSiteUploader from ".";


export default function SiteSubmitterParallax() {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setDraggableConfig = useMapStore((state) => state.actions.setDraggablePoint);

  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const onClose = async() => {
    setLevelTwoScreen(false);
    setDraggableConfig(null)
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapConfig(1, ScreenReturn.SiteSubmitter);
    setLevelTwoScreen(false);
  };

  return (
    <ParallaxDrawer headerImage={boatImage} onClose={onClose} onMapFlip={onNavigate}>
      <DiveSiteUploader />
    </ParallaxDrawer>
  );
}
