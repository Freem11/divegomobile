import React, { useContext, useEffect, useState } from "react";

import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { ActiveProfile } from "../../../entities/profile";
import { getDiveSiteRecentNinePhotos, getuserReveiewCount, getUserSightingsCount, getUserSpeciesCount } from "../../../supabaseCalls/accountSupabaseCalls";
import { getRecentReviewsByUserId } from "../../../supabaseCalls/diveSiteReviewCalls/gets";
import { Review } from "../../../entities/diveSiteReview";
import { useAppNavigation } from "../../mapPage/types";

import UserProfileScreenView from "./userProfile";

type UserProfileProps = {
  closeParallax?: (mapConfig: number) => void
  bottomHitCount?: number;
};

export default function UserProfileScreen({ closeParallax }: UserProfileProps) {
  const { selectedProfile } = useContext(SelectedProfileContext);

  const [profilePhotos, setProfilePhotos] = useState(null);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  const navigation = useAppNavigation();

  useEffect(() => {
    getData(selectedProfile);
  }, [selectedProfile]);

  const getData = async (selectedProfile: ActiveProfile) => {
    const species = await getUserSpeciesCount(selectedProfile.UserID);
    setSpeciesCount(species.distinct_label_count);

    const sightings = await getUserSightingsCount(selectedProfile.UserID);
    setSightingsCount(sightings.label_count);
    const recentNine = await getDiveSiteRecentNinePhotos(selectedProfile.UserID);
    setProfilePhotos(recentNine);

    const userReviewCount = await getuserReveiewCount(selectedProfile.UserID);
    setReviewCount(userReviewCount.label_count);

    const userReviews = await getRecentReviewsByUserId({ userId: selectedProfile.UserID, limit: 3 });
    setReviews(userReviews);
  };

  const openAllPhotosPage = () => {
    navigation.navigate("UserProfilePhotos");
  };

  return (
    <UserProfileScreenView
      profilePhotos={profilePhotos}
      selectedProfile={selectedProfile}
      speciesCount={speciesCount}
      sightingsCount={sightingsCount}
      reviewCount={reviewCount}
      openAllPhotosPage={openAllPhotosPage}
      reviews={reviews}
    />
  );

}