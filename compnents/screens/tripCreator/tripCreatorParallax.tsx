import React, { useContext } from "react";
import TripCreatorPage from "./detailsScreen/tripCreator";
import SiteList from "./siteListScreen/siteList";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { DiveSpotContext } from "../../contexts/diveSpotContext";


export default function TripCreatorParallax() {

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
        <ParallaxDrawer
            headerImage={require('../../png/boat.png')} children={[<TripCreatorPage />, <SiteList/>]} onClose={onClose}
        />
    )
}

