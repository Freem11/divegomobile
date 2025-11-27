import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { insertItineraryRequest, itineraries } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { ItineraryItem } from "../../../entities/itineraryItem";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { useMapStore } from "../../googleMap/useMapStore";
import { DiveShop } from "../../../entities/diveShop";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { calculateRegionFromBoundaries } from "../../googleMap/regionCalculator";
import { useAppNavigation } from "../../mapPage/types";
import { MapConfigurations } from "../../googleMap/types";

import DiveShopScreenView from "./diveShop";
import { useDiveShopNavigation } from "./types";

type DiveShopProps = {
  closeParallax?: (mapConfig: number) => void;
  restoreParallax?: () => void;
  selectedShop: DiveShop;
  bottomHitCount?: number;
  isMyShop: boolean
};

export default function DiveShopScreen({
  closeParallax,
  restoreParallax,
  selectedShop,
  bottomHitCount,
  isMyShop
}: DiveShopProps) {
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const diveShopNavigation = useDiveShopNavigation();
  const [tripsCount, setTripsCount] = useState(0);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setInitConfig = useMapStore((state) => state.actions.setInitConfig);
  const mapRef = useMapStore((state) => state.mapRef);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);

  const { setEditMode } = useContext(EditModeContext);
  const [itineraryList, setItineraryList] = useState<ItineraryItem[] | null>();
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setSitesArray } = useContext(SitesArrayContext);

  const getItineraries = async (IdNum: number) => {
    try {
      const itins = await itineraries(IdNum);
      setItineraryList(itins);
      setTripsCount(itins?.length || 0);
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    if (selectedShop) {
      getItineraries(selectedShop.id);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (levelOneScreen) {
      restoreParallax();
    }
  }, [levelOneScreen]);

  const handleMapFlip = async (sites: number[]) => {
    if (mapRef) {
      setInitConfig(MapConfigurations.TripView);
      const region = await calculateRegionFromBoundaries(mapRef);
      setMapRegion(region);

      setSitesArray(sites);

      navigation.navigate("GoogleMap");

      const itinerizedDiveSites = await getDiveSitesByIDs(JSON.stringify(sites));

      const coordinates = itinerizedDiveSites.map(site => ({
        latitude: site.lat,
        longitude: site.lng,
      }));

      mapRef?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });

      setMapConfig(MapConfigurations.TripView, { pageName: "DiveShop", itemId: selectedShop.id });
    }
  };

  const handleEditButton = (id: number, name: string, shopId: number) => {
    diveShopNavigation.navigate("TripCreator", { id, subTitle: name, shopId });
  };

  const handleDeleteButton = (itineraryInfo: ItineraryItem) => {
    insertItineraryRequest(
      {
        OriginalItineraryID: itineraryInfo.id,
        BookingPage: itineraryInfo.BookingPage,
        tripName: itineraryInfo.tripName,
        startDate: itineraryInfo.startDate,
        endDate: itineraryInfo.endDate,
        price: itineraryInfo.price,
        description: itineraryInfo.description,
        siteList: itineraryInfo.siteList,
        shopID: itineraryInfo.shopID,
      },
      "Delete"
    );
    diveShopNavigation.navigate("ConfirmationScreen", { title: t("TripCreator.completeDeleteTitle"), subTitle: t("TripCreator.completeDeleteDescription"), returnNav: () => diveShopNavigation.goBack() });
  };

  return (
    <DiveShopScreenView
      isMyShop={isMyShop}
      itineraryList={itineraryList}
      selectedShop={selectedShop}
      handleMapFlip={handleMapFlip}
      handleEditButton={handleEditButton}
      handleDeleteButton={handleDeleteButton}
      tripsCount={tripsCount}
    />
  );

}