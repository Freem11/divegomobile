import React, { useContext } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { DiveSpotContext } from "../../contexts/diveSpotContext";
import boatImage from "../../png/boat.png";
import { Keyboard } from "react-native";
import { useMapStore } from "../../googleMap/useMapStore";

export default function SiteSubmitterParallax() {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setDraggableConfig = useMapStore((state) => state.actions.setDraggablePoint);

  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

  const onClose = async () => {
    setLevelTwoScreen(false);
    setDraggableConfig(null)
    setAddSiteVals({
      ...addSiteVals,
      Site: "",
      Latitude: "",
      Longitude: "",
    });
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapConfig(1, 0);
    setLevelTwoScreen(false);
  };

  return (
    <ParallaxDrawer headerImage={boatImage} onClose={onClose} onMapFlip={onNavigate}>
      <DiveSiteUploader 
          onClose={onClose}
          onMapFlip={onNavigate}/>
    </ParallaxDrawer>
  );
}
