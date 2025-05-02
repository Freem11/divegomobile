import React, { useContext } from "react";
import TripCreatorPage from "./tripCreator";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { TripDetailContext } from "../../contexts/tripDetailsContext";


export default function TripCreatorParallax() {
    const { editMode, setEditMode } = useContext(EditModeContext);
    const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
    const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
    const { formValues, setFormValues } = useContext(TripDetailContext);
    const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

    const onClose = async () => {
      setEditMode(false);
      setSitesArray([]);
      setTripDiveSites([]);
      setFormValues({
        ...formValues,
        BookingPage: "",
        tripName: "",
        startDate: "",
        endDate: "",
        price: 0,
        description: "",
        siteList: [],
      });
      setLevelTwoScreen(false);
      };
      
    return (
        <ParallaxDrawer
            headerImage={require('../../png/boat.png')} children={[<TripCreatorPage />]} onClose={onClose}
        />
    )
}

