import React, { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../contexts/userProfileContext";
import UserProfileScreenView from "./userProfile";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { getProfilePhotosByUser } from "../../../supabaseCalls/photoSupabaseCalls";
import { Pagination } from "../../../entities/pagination";
import { Photo } from "../../../entities/photos";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";

type UserProfileProps = {
  closeParallax?: (mapConfig: number) => void
  bottomHitCount?: number;
};

export default function UserProfileScreen({
  closeParallax,
  bottomHitCount
}: UserProfileProps) {

  const { profile } = useContext(UserProfileContext);
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );
  const [profilePhotos, setProfilePhotos] = useState(null);
  
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  
  const handleDiveSiteMove = async (pic: Photo, photoPacket) => {
    setSelectedDiveSite({
      SiteName: photoPacket.name,
      Latitude: pic.latitude,
      Longitude: pic.longitude
    });
    closeParallax(1)
    setLevelTwoScreen(false);
  };

  const getPhotos = async () => {
    const pagination = new Pagination({page: bottomHitCount, ipp: 10})

    let photos;
    if (selectedProfile?.UserID) {
      photos = await getProfilePhotosByUser(
        selectedProfile.UserID,
        profile.UserID,
        pagination
      );
    } else {
      photos = await getProfilePhotosByUser(
        profile.UserID,
        profile.UserID,
        pagination
      );
    }
    setProfilePhotos((prev) => prev ? [...prev, ...photos] : photos);
  };

  useEffect(() => {
    getPhotos();
  }, [selectedProfile, bottomHitCount]);


  return (
    <UserProfileScreenView
      profilePhotos={profilePhotos}
      selectedProfile={selectedProfile}
      handleDiveSiteMove={handleDiveSiteMove}
    />
  )

}