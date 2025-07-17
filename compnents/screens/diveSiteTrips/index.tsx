import React, { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { useTranslation } from "react-i18next";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import DiveSiteTripsPageView from "./divesiteTrips";
import { getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { useMapStore } from "../../googleMap/useMapStore";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

type DiveSiteTripsPageProps = {};

export default function DiveSiteTripsPage({}: DiveSiteTripsPageProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { profile } = useContext(UserProfileContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const [diveSiteTrips, setDiveSiteTrips] = useState([])

  const { t } = useTranslation();

  const getTrips = async (diveSiteId: number) => {
    const data = await getItinerariesForDiveSite(diveSiteId)
    setDiveSiteTrips(data)
  }

  useEffect(() => {
    getTrips(selectedDiveSite.id)
  },[selectedDiveSite])


  const handleMapFlip = async (sites: number[], shopID: number) => {
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

    setFullScreenModal(false)
    setLevelOneScreen(false)
    // to do: need to pass identifier so map knows if we are returning to a dive shop or dive site page
    // dive site ID should be passed here but right now return function assumes dive shop
    setMapConfig(2, shopID)
  };
  return (
    <DiveSiteTripsPageView
      diveTrips={diveSiteTrips}
      title={selectedDiveSite.name}
      setFullScreenModal={setFullScreenModal}
      handleMapFlip={handleMapFlip}
    />
  )

}