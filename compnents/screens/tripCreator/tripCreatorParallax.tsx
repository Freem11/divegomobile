import React, { useContext } from "react";
import TripCreatorPage from "./tripCreator";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import TripImage from '../../png/Trip.png'
import { Keyboard } from "react-native";
import IconWithLabel from "../../reusables/iconWithLabal";
import { useTranslation } from "react-i18next";
import { useMapStore } from "../../googleMap/useMapStore";


type TripCreatorProps = {
  shopID: number
};

export default function TripCreatorParallax(props: TripCreatorProps) {
  const { t } = useTranslation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  
  const { editMode, setEditMode } = useContext(EditModeContext);
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

  const onNavigate = async() => {
    Keyboard.dismiss();
    setMapConfig(3, 0);
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
      <TripCreatorPage selectedShop={props.shopID}/>

    </ParallaxDrawer>
  );
}
