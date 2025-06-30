import React, { useContext } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import boatImage from "../../png/boat.png";
import { Keyboard } from "react-native";
import { useMapStore } from "../../googleMap/useMapStore";
import { ScreenReturn } from "../../googleMap/types";


export default function SiteSubmitterParallax() {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setDraggableConfig = useMapStore((state) => state.actions.setDraggablePoint);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const onClose = async () => {
    setFormValues(null)
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
