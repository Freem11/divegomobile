import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { useMapStore } from "../../googleMap/useMapStore";
import { LevelThreeScreenContext } from "../../contexts/levelThreeScreenContext";
import { MapConfigurations } from "../../googleMap/types";

import DiveSiteTripsPageView from "./divesiteTrips";
import { useDiveSiteNavigation } from "../diveSite/types";

type DiveSiteTripsPageProps = {};

export default function DiveSiteTripsPage({ }: DiveSiteTripsPageProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);

  const diveSiteNavigation = useDiveSiteNavigation();
  const [diveSiteTrips, setDiveSiteTrips] = useState([]);

  const { t } = useTranslation();

  const getTrips = async (diveSiteId: number) => {
    const data = await getItinerariesForDiveSite(diveSiteId);
    setDiveSiteTrips(data);
  };

  const onClose = async () => {
    diveSiteNavigation.goBack();
  };

  useEffect(() => {
    getTrips(selectedDiveSite.id);
  }, [selectedDiveSite]);

  const handleMapFlip = async (sites: number[]) => {
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

    setMapConfig(MapConfigurations.TripView, { pageName: "DiveSite", itemId: selectedDiveSite.id });
  };
  return (
    <DiveSiteTripsPageView
      diveTrips={diveSiteTrips}
      title={selectedDiveSite.name}
      onClose={onClose}
      handleMapFlip={handleMapFlip}
    />
  );

}