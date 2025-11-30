import React, { useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { getDiveSiteSightingCount, getDiveSiteSpeciesCount, getDiveSiteRecentNinePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { getDiveSiteTripCount, getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { ItineraryItem } from "../../../entities/itineraryItem";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { useMapStore } from "../../googleMap/useMapStore";
import { getRecentThreeReviewsBySiteId } from "../../../supabaseCalls/diveSiteReviewCalls/gets";
import { Review } from "../../../entities/diveSiteReview";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { MetricItem } from "../../../entities/metricItem";
import { calculateRegionFromBoundaries } from "../../googleMap/regionCalculator";
import { useAppNavigation } from "../../mapPage/types";
import { MapConfigurations } from "../../googleMap/types";

import DiveSiteScreenView from "./diveSite";
import { useDiveSiteNavigation } from "./types";

type DiveSiteProps = {
  closeParallax?: (mapConfig: number) => void;
  restoreParallax?: () => void;
  selectedDiveSite: DiveSiteWithUserName;
  metricInfo: MetricItem[];
  openPicUploader: () => void;
  openDiveSiteReviewer: () => void;
};

export default function DiveSiteScreen({
  selectedDiveSite,
  metricInfo,
  openPicUploader,
  closeParallax,
  restoreParallax,
  openDiveSiteReviewer
}: DiveSiteProps) {

  const { userProfile } = useUserProfile();
  const navigation = useAppNavigation();
  const diveSiteNavigation = useDiveSiteNavigation();
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const mapRef = useMapStore((state) => state.mapRef);
  const setInitConfig = useMapStore((state) => state.actions.setInitConfig);
  const [diveSitePics, setDiveSitePics] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);
  const [itineraries, setItineraries] = useState<ItineraryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { setSitesArray } = useContext(SitesArrayContext);

  const openAllPhotosPage = () => {
    diveSiteNavigation.navigate("DiveSitePhotos");
  };

  const openAllTripsPage = () => {
    diveSiteNavigation.navigate("DiveSiteTrips");
  };

  const handleEditReview = (review: Review) => {
    diveSiteNavigation.navigate("SiteReviewCreator", {
      selectedDiveSite: selectedDiveSite.id,
      siteName: selectedDiveSite.name,
      reviewToEdit: review
    });
  };

  const handleDeleteReview = (reviewId: number) => {
    console.log("Report review:", reviewId);
  };

  const handleMapFlip = async (sites: number[]) => {
    if (mapRef) {
      setInitConfig(MapConfigurations.TripView);
      const region = await calculateRegionFromBoundaries(mapRef);
      setMapRegion(region);

      setSitesArray(sites);

      navigation.navigate("GoogleMap");

      setMapConfig(MapConfigurations.TripView, { pageName: "DiveSite", itemId: selectedDiveSite.id });
    }
  };

  useEffect(() => {
    if (selectedDiveSite) {
      getData(selectedDiveSite);
    }
  }, [selectedDiveSite.id]);

  // Refresh reviews when screen comes back into focus (e.g., after editing a review)
  useFocusEffect(
    React.useCallback(() => {
      refreshReviews();
    }, [selectedDiveSite?.id])
  );

  const refreshReviews = async () => {
    if (selectedDiveSite?.id) {
      const diveSiteReviews = await getRecentThreeReviewsBySiteId(selectedDiveSite.id);
      setReviews(diveSiteReviews);
    }
  };

  const getData = async (selectedDiveSite: DiveSiteWithUserName) => {
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

    const diveSiteReviews = await getRecentThreeReviewsBySiteId(selectedDiveSite.id);
    setReviews(diveSiteReviews);
  };

  return (
    <DiveSiteScreenView
      selectedDiveSite={selectedDiveSite}
      diveSitePics={diveSitePics}
      speciesCount={speciesCount}
      sightingsCount={sightingsCount}
      tripCount={tripCount}
      metricInfo={metricInfo}
      itineraries={itineraries}
      reviews={reviews}
      currentUserId={userProfile?.UserID}
      openPicUploader={openPicUploader}
      openDiveSiteReviewer={openDiveSiteReviewer}
      openAllPhotosPage={openAllPhotosPage}
      openAllTripsPage={openAllTripsPage}
      handleMapFlip={handleMapFlip}
      onEditReview={handleEditReview}
      onDeleteReview={handleDeleteReview}
    />
  );

}