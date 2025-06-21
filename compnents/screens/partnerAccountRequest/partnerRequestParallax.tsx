import React, { useContext } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import boatImage from "../../png/boat.png";
import { Keyboard } from "react-native";
import { useMapStore } from "../../googleMap/useMapStore";
import PartnerAccountRequestPage from ".";
import { ScreenReturn } from "../../googleMap/types";

export default function PartnerRequestParallax() {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setDraggableConfig = useMapStore((state) => state.actions.setDraggablePoint);

  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const onClose = async () => {
    setLevelTwoScreen(false);
    setDraggableConfig(null)
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapConfig(1, ScreenReturn.PartnerRequestPage);
    setLevelTwoScreen(false);
  };

  return (
    <ParallaxDrawer headerImage={boatImage} onClose={onClose} onMapFlip={onNavigate}>
      <PartnerAccountRequestPage />
    </ParallaxDrawer>
  );
}
