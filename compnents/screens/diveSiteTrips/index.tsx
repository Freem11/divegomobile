import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { useMapStore } from "../../googleMap/useMapStore";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { LevelThreeScreenContext } from "../../contexts/levelThreeScreenContext";
import { MapConfigurations } from "../../googleMap/types";

import DiveSiteTripsPageView from "./divesiteTrips";

type DiveSiteTripsPageProps = {};

export default function DiveSiteTripsPage({ }: DiveSiteTripsPageProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setLevelThreeScreen } = useContext(
    LevelThreeScreenContext
  );
  const { setSitesArray } = useContext(SitesArrayContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const [diveSiteTrips, setDiveSiteTrips] = useState([]);

  const { t } = useTranslation();

  const getTrips = async (diveSiteId: number) => {
    const data = await getItinerariesForDiveSite(diveSiteId);
    setDiveSiteTrips(data);
  };

  useEffect(() => {
    getTrips(selectedDiveSite.id);
  }, [selectedDiveSite]);

  const handleMapFlip = async (sites: number[], shopID: number) => {
    setSitesArray(sites);
    const itinerizedDiveSites = await getDiveSitesByIDs(JSON.stringify(sites));

    const coordinates = itinerizedDiveSites.map(site => ({
      latitude: site.lat,
      longitude: site.lng,
    }));

    mapRef?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });

    setLevelThreeScreen(false);
    setLevelOneScreen(false);
    setMapConfig(MapConfigurations.TripView, { pageName: "DiveSite", itemId: selectedDiveSite.id });
  };
  return (
    <DiveSiteTripsPageView
      diveTrips={diveSiteTrips}
      title={selectedDiveSite.name}
      setLevelThreeScreen={setLevelThreeScreen}
      handleMapFlip={handleMapFlip}
    />
  );

}