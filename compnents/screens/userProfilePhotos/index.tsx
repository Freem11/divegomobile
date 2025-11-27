import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getPhotosByUserWithExtra } from "../../../supabaseCalls/photoSupabaseCalls";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { Photo } from "../../../entities/photos";
import { useMapStore } from "../../googleMap/useMapStore";
import { ActiveProfile } from "../../../entities/profile";
import { useUserProfile } from "../../../store/user/useUserProfile";

import UserProfilePhotosPageView from "./userProfilePhotos";
import { useAppNavigation } from "../../mapPage/types";

type UserProfilePhotosPageProps = {};

export default function UserProfilePhotosPage({ }: UserProfilePhotosPageProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const { userProfile } = useUserProfile();
  const { selectedProfile } = useContext(SelectedProfileContext);

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

  const handleDiveSiteMove = async (pic: Photo, photoPacket) => {

    const coordinates = [{
      latitude: pic.latitude,
      longitude: pic.longitude,
    }];

    mapRef?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
    // todo: need to close parallax here to prevent modal form sticking up when closed
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