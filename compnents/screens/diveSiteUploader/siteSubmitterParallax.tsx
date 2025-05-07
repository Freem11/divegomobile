import React, { useContext } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { DiveSpotContext } from "../../contexts/diveSpotContext";
import boatImage from "../../png/boat.png";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";

export default function SiteSubmitterParallax() {
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  
  const onClose = async () => {
    setLevelTwoScreen(false);
    setAddSiteVals({
      ...addSiteVals,
      Site: "",
      Latitude: "",
      Longitude: "",
    });
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setChosenModal("DiveSite");
    setMapHelper(true);
    setMapConfig(1);
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
