import React, { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { useTranslation } from "react-i18next";
import { getPhotosByUserWithExtra } from "../../../supabaseCalls/photoSupabaseCalls";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import UserProfilePhotosPageView from "./userProfilePhotos";
import { Photo } from "../../../entities/photos";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { useMapStore } from "../../googleMap/useMapStore";

type UserProfilePhotosPageProps = {};

export default function UserProfilePhotosPage({}: UserProfilePhotosPageProps) {
  const mapRef = useMapStore((state) => state.mapRef);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { profile } = useContext(UserProfileContext);
  const { selectedProfile } = useContext(SelectedProfileContext);
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);


  const [profilePhotos, setProfilePhotos] = useState([]);

  const { t } = useTranslation();

  const getPhotos = async (selectedProfile, profile) => {
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
    if (selectedProfile && profile) {
      getPhotos(selectedProfile, profile);
    }
  }, [selectedProfile, profile]);
  
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
    setFullScreenModal(false);
    setLevelTwoScreen(false);
  };
  
  return (
    <UserProfilePhotosPageView
      photos={profilePhotos}
      title={selectedProfile && selectedProfile.UserName}
      setFullScreenModal={setFullScreenModal}
      handleDiveSiteMove={handleDiveSiteMove}
    />
  )

}