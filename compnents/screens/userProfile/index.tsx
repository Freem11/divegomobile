import React, { useEffect, useState } from "react";

import { ActiveProfile } from "../../../entities/profile";
import {
  getDiveSiteRecentNinePhotos,
  getuserReveiewCount,
  getUserSightingsCount,
  getUserSpeciesCount
} from "../../../supabaseCalls/accountSupabaseCalls";
import { getRecentReviewsByUserId } from "../../../supabaseCalls/diveSiteReviewCalls/gets";
import { Review } from "../../../entities/diveSiteReview";
import { useAppNavigation } from "../../mapPage/types";

import UserProfileScreenView from "./userProfile";

type UserProfileScreenProps = {
  selectedProfile: any;
  followInfo: () => { label: string; action: () => void } | null
  isMyProfile: boolean
};

export default function UserProfileScreen({ selectedProfile, followInfo, isMyProfile }: UserProfileScreenProps) {
  const [profilePhotos, setProfilePhotos] = useState(null);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  const navigation = useAppNavigation();

  useEffect(() => {
    if (selectedProfile?.UserID) {
      getData(selectedProfile);
    }
  }, [selectedProfile?.UserID]);

  const getData = async (profile: ActiveProfile) => {
    setProfilePhotos(null);
    setReviews([]);
    setSpeciesCount(0);
    setSightingsCount(0);

    const [species, sightings, recentNine, userReviewCount, userReviews] = await Promise.all([
      getUserSpeciesCount(profile.UserID),
      getUserSightingsCount(profile.UserID),
      getDiveSiteRecentNinePhotos(profile.UserID),
      getuserReveiewCount(profile.UserID),
      getRecentReviewsByUserId({ userId: profile.UserID, limit: 3 })
    ]);

    setSpeciesCount(species.distinct_label_count);
    setSightingsCount(sightings.label_count);
    setProfilePhotos(recentNine);
    setReviewCount(userReviewCount.label_count);
    setReviews(userReviews);
  };

  const openAllPhotosPage = () => {
    navigation.navigate("UserProfilePhotos");
  };

  const handleDiveSiteMove = async (diveSiteName: string, diveSiteId: number) => {
    navigation.navigate("DiveSiteNavigator", { id: diveSiteId });
  };

  return (
    <UserProfileScreenView
      profilePhotos={profilePhotos}
      selectedProfile={selectedProfile}
      speciesCount={speciesCount}
      sightingsCount={sightingsCount}
      reviewCount={reviewCount}
      openAllPhotosPage={openAllPhotosPage}
      handleDiveSiteMove={handleDiveSiteMove}
      reviews={reviews}
      followInfo={followInfo}
      isMyProfile={isMyProfile}
    />
  );
}