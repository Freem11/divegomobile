import React, { useContext, useEffect, useState } from "react";
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
import { getItineraryDiveSiteByIdArray, getTripById } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { ItineraryItem } from "../../../entities/itineraryItem";

import TripCreatorPage from ".";

type TripCreatorProps = {
  id: number | null
};

export default function TripCreatorParallax(props: TripCreatorProps) {
  const { t } = useTranslation();
  const diveShopNavigation = useDiveShopNavigation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setTripDiveSites } = useContext(TripSitesContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const [selectedTrip, setSelectedTrip] = useState<ItineraryItem>();

  useEffect(() => {
    getDiveSiteinfo();
  }, [props.id]);

  const getDiveSiteinfo = async () => {
    if (props.id) {
      const tripInfo = await getTripById(props.id);
      setSelectedTrip(tripInfo[0]);
      setSitesArray(tripInfo[0].siteList);
      if (tripInfo) {
        setEditMode(true);
      }
    }
  };

  useEffect(() => {
    if (selectedTrip) {
      getTripDiveSites(selectedTrip.siteList);
    }

  }, [selectedTrip]);

  const getTripDiveSites = async (siteIds: number[]) => {
    try {
      const success = await getItineraryDiveSiteByIdArray(siteIds);
      if (success) {
        setTripDiveSites(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const onClose = () => {
    setFormValues({
      Name: "",
      Link: "",
      Details: "",
      Price: "",
      Start: "",
      End: ""
    });
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
      <TripCreatorPage itineraryInfo={selectedTrip} getTripDiveSites={getTripDiveSites} />

    </ParallaxDrawer>
  );
}
