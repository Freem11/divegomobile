import React, { useContext } from "react";
import TripCreatorPage from "./tripCreator";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import boatImage from "../../png/boat.png";

export default function TripCreatorParallax() {
  const { setEditMode } = useContext(EditModeContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setTripDiveSites } = useContext(TripSitesContext);
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
      headerImage={boatImage}
      onClose={onClose}
    >
      <TripCreatorPage />
    </ParallaxDrawer>
  );
}
