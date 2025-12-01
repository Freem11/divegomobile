import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getPhotosByUserWithExtra } from "../../../supabaseCalls/photoSupabaseCalls";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { useMapStore } from "../../googleMap/useMapStore";
import { ActiveProfile } from "../../../entities/profile";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { useAppNavigation } from "../../mapPage/types";
import { region } from "../../../entities/region";

import UserProfilePhotosPageView from "./userProfilePhotos";

type UserProfilePhotosPageProps = {};

export default function UserProfilePhotosPage({ }: UserProfilePhotosPageProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const { userProfile } = useUserProfile();
  const { selectedProfile } = useContext(SelectedProfileContext);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);

  const [profilePhotos, setProfilePhotos] = useState([]);

  const { t } = useTranslation();

  const navigation = useAppNavigation();

  const getPhotos = async (selectedProfile, profile: ActiveProfile) => {
    let photos;
    if (selectedProfile?.UserID) {
      photos = await getPhotosByUserWithExtra(
        selectedProfile.UserID,
        profile.UserID
      );
    } else {
      photos = await getPhotosByUserWithExtra(
        profile.UserID,
        profile.UserID
      );
    }
    setProfilePhotos(photos);
  };

  useEffect(() => {
    if (selectedProfile && userProfile) {
      getPhotos(selectedProfile, userProfile);
    }
  }, [selectedProfile, userProfile]);

  const handleDiveSiteMove = async (latitude: number, longitude: number) => {

    const diveSiteLocation: region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    };

    setMapRegion(diveSiteLocation);
    navigation.navigate("BottomTab");
  };

  return (
    <UserProfilePhotosPageView
      photos={profilePhotos}
      title={selectedProfile && selectedProfile.UserName}
      onClose={navigation.goBack}
      handleDiveSiteMove={handleDiveSiteMove}
    />
  );

}