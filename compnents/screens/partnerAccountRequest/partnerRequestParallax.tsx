import React, { useContext } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import partnerRayImage from "../../png/partnerRay.jpg";
import { Keyboard } from "react-native";
import { useMapStore } from "../../googleMap/useMapStore";
import PartnerAccountRequestPage from ".";
import { ScreenReturn } from "../../googleMap/types";


export default function PartnerRequestParallax() {
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
    setMapConfig(1, {pageName: ScreenReturn.PartnerRequestPage as unknown as string, itemId: 0});
    setLevelTwoScreen(false);
  };

  return (
    <ParallaxDrawer headerImage={partnerRayImage} onClose={onClose} onMapFlip={onNavigate}>
      <PartnerAccountRequestPage />
    </ParallaxDrawer>
  );
}
