import React, { useContext, useRef } from "react";
import TripCreatorPage from "./tripCreator";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import TripImage from '../../png/Trip.jpg'
import { Keyboard } from "react-native";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";

export default function TripCreatorParallax() {

  const { setEditMode } = useContext(EditModeContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setTripDiveSites } = useContext(TripSitesContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  
 
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

  const onNavigate = async() => {
    Keyboard.dismiss();
    setMapHelper(true);
    setMapConfig(3);
    setLevelTwoScreen(false);
  };


  return (
    <ParallaxDrawer
      headerImage={TripImage}
      onClose={onClose}
      onMapFlip={onNavigate}
    >
      <TripCreatorPage 
        onClose={onClose} onMapFlip={onNavigate}
        />

    </ParallaxDrawer>
  );
}
