import React, { useContext } from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";

import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import TripImage from "../../png/Trip.png";
import IconWithLabel from "../../reusables/iconWithLabal";
import { useMapStore } from "../../googleMap/useMapStore";
import { useDiveShopNavigation } from "../diveShop/types";

import TripCreatorPage from ".";

type TripCreatorProps = {
  itineraryID: number
};

export default function TripCreatorParallax(props: TripCreatorProps) {
  const { t } = useTranslation();
  const diveShopNavigation = useDiveShopNavigation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const storeFormValues = useMapStore((state) => state.formValues);
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setTripDiveSites } = useContext(TripSitesContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const onClose = () => {
    setFormValues(null);
    setEditMode(false);
    setSitesArray([]);
    setTripDiveSites([]);

    diveShopNavigation.goBack();
  };

  const onNavigate = async () => {
    Keyboard.dismiss();
    setMapConfig(3, { pageName: "DiveShop", itemId: 0 });
    setLevelTwoScreen(false);
  };

  const cloneButtonPress = () => {
    setEditMode(false);
  };

  const popoverContent = () => {
    return (
      <>
        <IconWithLabel
          label={t("TripCreator.cloneButton")}
          iconName="vector-arrange-below"
          buttonAction={() => cloneButtonPress()}
        />
      </>
    );
  };

  return (
    <ParallaxDrawer
      headerImage={TripImage}
      onClose={onClose}
      onMapFlip={onNavigate}
      popoverContent={editMode && popoverContent}
    >
      <TripCreatorPage itineraryInfo={storeFormValues} />

    </ParallaxDrawer>
  );
}
