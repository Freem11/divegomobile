import React, { useContext, useEffect, useState } from "react";
import DiveShopScreenView from "./diveShop";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { insertItineraryRequest, itineraries } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { ItineraryItem } from "../../../entities/itineraryItem";
import { useMapFlip } from "../../itineraries/hooks";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { useMapStore } from "../../googleMap/useMapStore";
import { DiveShop } from "../../../entities/diveShop";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";


type DiveShopProps = {
  closeParallax?: (mapConfig: number) => void
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

  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const mapRef = useMapStore((state) => state.mapRef);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);

  const { setEditMode } = useContext(EditModeContext);
  const [itineraryList, setItineraryList] = useState<ItineraryItem[] | null>();
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  
  const getItineraries = async (IdNum: number) => {
    try {
      const itins = await itineraries(IdNum);
      setItineraryList(itins);
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
    if(levelOneScreen){
      restoreParallax();
    }
  }, [levelOneScreen]);


  const handleMapFlip = async (sites: number[]) => {
     setSitesArray(sites);
     let itinerizedDiveSites = await getDiveSitesByIDs(JSON.stringify(sites));
   
     const coordinates = itinerizedDiveSites.map(site => ({
      latitude: site.lat,
      longitude: site.lng,
    }));
    
    mapRef?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });

     setMapConfig(2, selectedShop.id)
     closeParallax(1)
   };
   
   const handleEditButton = (itineraryInfo: ItineraryItem) => {
    setEditMode(true);
    setLevelOneScreen(false);
    setLevelTwoScreen(true);
    setActiveScreen("TripCreatorScreen", {id: selectedShop.id});
    setFormValues(itineraryInfo)
    setSitesArray(itineraryInfo.siteList)
  };

  const handleDeleteButton = (itineraryInfo: ItineraryItem) => {
    insertItineraryRequest(
      {
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
  };

  
  return (
    <DiveShopScreenView
      isMyShop={isMyShop}
      itineraryList={itineraryList}
      selectedShop={selectedShop}
      handleMapFlip={handleMapFlip}
      handleEditButton={handleEditButton}
      handleDeleteButton={handleDeleteButton}
    />
  )

}