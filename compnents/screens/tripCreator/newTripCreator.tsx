import React, { useContext } from "react";
import ButtonIcon from "../../reusables/buttonIcon";
import Paginator from "../../reusables/paginator";
import TripCreatorPage from "./detailsScreen/tripCreator";
import SiteList from "./siteListScreen/siteList";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteUploader from "../diveSiteUploader";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { DiveSpotContext } from "../../contexts/diveSpotContext";
export default function NewTripCreatorPage() {

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
            headerImage={require('../../png/boat.png')} children={[<DiveSiteUploader />]} onClose={onClose}
        />

        //  <Paginator>
        //      <Paginator.Screens>
        //          <TripCreatorPage />
        //          <SiteList/>
        //      </Paginator.Screens>

        //      <Paginator.Buttons>
        //          <ButtonIcon size="icon" icon="diving-scuba-flag" title="Tip Details" />
        //          <ButtonIcon size="icon" icon="anchor" title="Dive Sites"/>
        //      </Paginator.Buttons>
        //  </Paginator>
    )
}

