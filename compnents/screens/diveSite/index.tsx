import React, { useContext, useEffect, useState } from "react";

import { getDiveSiteSightingCount, getDiveSiteSpeciesCount, getDiveSiteRecentNinePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { getDiveSiteTripCount } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

import DiveSiteScreenView from "./diveSite";

type DiveSiteProps = {
  selectedDiveSite: DiveSiteWithUserName;
  openPicUploader: () => void;
};

export default function DiveSiteScreen({ selectedDiveSite, openPicUploader }: DiveSiteProps) {
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const [diveSitePics, setDiveSitePics] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);

  const openAllPhotosPage = () => {
    setFullScreenModal(true);
    //to do: need to change what modal animation this runs on
    setActiveTutorialID("DiveSitePhotos");
  };

  const openAllTripsPage = () => {
    setFullScreenModal(true);
    //to do: need to change what modal animation this runs on
    setActiveTutorialID("DiveSiteTrips");
  };

  useEffect(() => {
    if (selectedDiveSite){
      getData(selectedDiveSite);
    }
  },[selectedDiveSite]);

  const getData = async(selectedDiveSite: DiveSiteWithUserName) => {
    const trips = await getDiveSiteTripCount(selectedDiveSite.id);
    setTripCount(trips.label_count);

    const species = await getDiveSiteSpeciesCount({ lat: selectedDiveSite.lat, lng: selectedDiveSite.lng });
    setSpeciesCount(species.distinct_label_count);

    const sightingsCount = await getDiveSiteSightingCount({ lat: selectedDiveSite.lat, lng: selectedDiveSite.lng });
    setSightingsCount(sightingsCount.label_count);

    const recentNine = await getDiveSiteRecentNinePhotos({ lat: selectedDiveSite.lat, lng: selectedDiveSite.lng });
    setDiveSitePics(recentNine);

  };

  return (
    <DiveSiteScreenView
      selectedDiveSite={selectedDiveSite}
      diveSitePics={diveSitePics}
      speciesCount={speciesCount}
      sightingsCount={sightingsCount}
      tripCount={tripCount}
      openPicUploader={openPicUploader}
      openAllPhotosPage={openAllPhotosPage}
      openAllTripsPage={openAllTripsPage}
    />
  );

}