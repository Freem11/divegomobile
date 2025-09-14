import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { getPhotosByUserWithExtra } from "../../../supabaseCalls/photoSupabaseCalls";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { Photo } from "../../../entities/photos";
import { useMapStore } from "../../googleMap/useMapStore";
import { LevelThreeScreenContext } from "../../contexts/levelThreeScreenContext";
import { ActiveProfile } from "../../../entities/profile";
import { useUserProfile } from "../../../store/user/useUserProfile";

import UserProfilePhotosPageView from "./userProfilePhotos";

type UserProfilePhotosPageProps = {};

export default function UserProfilePhotosPage({}: UserProfilePhotosPageProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setLevelThreeScreen } = useContext(
    LevelThreeScreenContext
  );
  const { userProfile } = useUserProfile();
  const { selectedProfile } = useContext(SelectedProfileContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const [profilePhotos, setProfilePhotos] = useState([]);

  const { t } = useTranslation();

  const getPhotos = async(selectedProfile, profile: ActiveProfile) => {
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

  const handleDiveSiteMove = async(pic: Photo, photoPacket) => {

    const coordinates = [{
      latitude: pic.latitude,
      longitude: pic.longitude,
    }];

    mapRef?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
    // todo: need to close parallax here to prevent modal form sticking up when closed
    setLevelThreeScreen(false);
    setLevelTwoScreen(false);
  };

  return (
    <UserProfilePhotosPageView
      photos={profilePhotos}
      title={selectedProfile && selectedProfile.UserName}
      setLevelThreeScreen={setLevelThreeScreen}
      handleDiveSiteMove={handleDiveSiteMove}
    />
  );

}