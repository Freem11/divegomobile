import React, { useContext, useEffect, useState } from "react";

import { getDiveSiteSightingCount, getDiveSiteSpeciesCount, getDiveSiteRecentNinePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { getDiveSiteTripCount, getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { ItineraryItem } from "../../../entities/itineraryItem";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { useMapStore } from "../../googleMap/useMapStore";
import { getDiveSitesByIDs } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import LevelOneScreen from "../../reusables/levelOneScreen";
import { LevelThreeScreenContext } from "../../contexts/levelThreeScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { getReviewsBySiteId } from "../../../supabaseCalls/diveSiteReviewCalls/posts";
import { Review } from "../../../entities/diveSiteReview";

import DiveSiteScreenView from "./diveSite";

type DiveSiteProps = {
  closeParallax?: (mapConfig: number) => void;
  restoreParallax?: () => void;
  selectedDiveSite: DiveSiteWithUserName;
  openPicUploader: () => void;
};

export default function DiveSiteScreen({
  selectedDiveSite,
  openPicUploader,
  closeParallax,
  restoreParallax
}: DiveSiteProps) {
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const mapRef = useMapStore((state) => state.mapRef);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelThreeScreen } = useContext(
    LevelThreeScreenContext
  );
  const [diveSitePics, setDiveSitePics] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);
  const [itineraries, setItineraries] = useState<ItineraryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { setSitesArray } = useContext(SitesArrayContext);

  const openAllPhotosPage = () => {
    setLevelThreeScreen(true);
    setActiveScreen("DiveSitePhotos");
  };

  const openAllTripsPage = () => {
    setLevelThreeScreen(true);
    setActiveScreen("DiveSiteTrips");
  };

  const handleMapFlip = async(sites: number[]) => {
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

    setMapConfig(2, { pageName: "DiveSite", itemId: selectedDiveSite.id });
    closeParallax(1);
  };

  useEffect(() => {
    if (LevelOneScreen){
      restoreParallax();
    }
  }, [LevelOneScreen]);

  useEffect(() => {
    if (selectedDiveSite){
      getData(selectedDiveSite);
    }
  },[selectedDiveSite.id]);

  const getData = async(selectedDiveSite: DiveSiteWithUserName) => {
    const trips = await getDiveSiteTripCount(selectedDiveSite.id);
    setTripCount(trips.label_count);

    const species = await getDiveSiteSpeciesCount({ lat: selectedDiveSite.lat, lng: selectedDiveSite.lng });
    setSpeciesCount(species.distinct_label_count);

    const sightingsCount = await getDiveSiteSightingCount({ lat: selectedDiveSite.lat, lng: selectedDiveSite.lng });
    setSightingsCount(sightingsCount.label_count);

    const recentNine = await getDiveSiteRecentNinePhotos({ lat: selectedDiveSite.lat, lng: selectedDiveSite.lng });
    setDiveSitePics(recentNine);

    const diveSiteItineraries = await getItinerariesForDiveSite(selectedDiveSite.id, true);
    setItineraries(diveSiteItineraries);

    const diveSiteReviews = await getReviewsBySiteId(selectedDiveSite.id);
    setReviews(diveSiteReviews);
  };

  return (
    <DiveSiteScreenView
      selectedDiveSite={selectedDiveSite}
      diveSitePics={diveSitePics}
      speciesCount={speciesCount}
      sightingsCount={sightingsCount}
      tripCount={tripCount}
      itineraries={itineraries}
      reviews={reviews}
      openPicUploader={openPicUploader}
      openAllPhotosPage={openAllPhotosPage}
      openAllTripsPage={openAllTripsPage}
      handleMapFlip={handleMapFlip}
    />
  );

}