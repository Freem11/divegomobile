import React, { useContext } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { DiveSpotContext } from "../../contexts/diveSpotContext";
import boatImage from "../../png/boat.png";

export default function SiteSubmitterParallax() {
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

  const onClose = async () => {
    setLevelTwoScreen(false);
    setAddSiteVals({
      ...addSiteVals,
      Site: "",
      Latitude: "",
      Longitude: "",
    });
  };

  return (
    <ParallaxDrawer headerImage={boatImage} onClose={onClose}>
      <DiveSiteUploader />
    </ParallaxDrawer>
  );
}
