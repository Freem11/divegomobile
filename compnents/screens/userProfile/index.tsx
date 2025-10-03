import React, { useContext, useEffect, useState } from "react";

import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { Photo } from "../../../entities/photos";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ActiveProfile } from "../../../entities/profile";
import { getDiveSiteRecentNinePhotos, getUserSightingsCount, getUserSpeciesCount } from "../../../supabaseCalls/accountSupabaseCalls";
import UserProfileScreenView from "./userProfile";
import { useAppNavigation } from "../../mapPage/types";

type UserProfileProps = {
  closeParallax?: (mapConfig: number) => void
  bottomHitCount?: number;
};

export default function UserProfileScreen({ closeParallax }: UserProfileProps) {
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { selectedProfile } = useContext(SelectedProfileContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const [profilePhotos, setProfilePhotos] = useState(null);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);

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
  };

  const handleDiveSiteMove = async (pic: Photo, photoPacket) => {
    setSelectedDiveSite({
      SiteName: photoPacket.name,
      Latitude: pic.latitude,
      Longitude: pic.longitude
    });
    closeParallax(1);
    setLevelTwoScreen(false);
  };

  const openAllPhotosPage = () => {
    navigation.navigate("UserProfilePhotos")
  };

  return (
    <UserProfileScreenView
      profilePhotos={profilePhotos}
      selectedProfile={selectedProfile}
      handleDiveSiteMove={handleDiveSiteMove}
      speciesCount={speciesCount}
      sightingsCount={sightingsCount}
      openAllPhotosPage={openAllPhotosPage}
    />
  );

}