import React, { useContext, useRef } from "react";
import TripCreatorPage from "./tripCreator";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import TripImage from '../../png/Trip.png'
import { Keyboard } from "react-native";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import IconWithLabel from "../../reusables/iconWithLabal";
import { useTranslation } from "react-i18next";

type TripCreatorProps = {
  shopID: number
};

export default function TripCreatorParallax(props: TripCreatorProps) {
  const { t } = useTranslation();
  const { editMode, setEditMode } = useContext(EditModeContext);
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

  const cloneButtonPress = () => {
    setEditMode(false);
  };

  const popoverConent = () => {
    return (
    <>
    <IconWithLabel 
    label={t('TripCreator.cloneButton')}
    iconName="vector-arrange-below"
    buttonAction={() => cloneButtonPress()}
    />
    </>
    )
  };

  return (
    <ParallaxDrawer
      headerImage={TripImage}
      onClose={onClose}
      onMapFlip={onNavigate}
      popoverConent={editMode && popoverConent}
    >
      <TripCreatorPage 
        onClose={onClose} onMapFlip={onNavigate} selectedShop={props.shopID}
        />

    </ParallaxDrawer>
  );
}
