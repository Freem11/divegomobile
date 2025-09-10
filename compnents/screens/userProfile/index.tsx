import React, { useContext, useEffect, useState } from "react";

import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { Photo } from "../../../entities/photos";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ActiveProfile } from "../../../entities/profile";
import { getDiveSiteRecentNinePhotos, getUserSightingsCount, getUserSpeciesCount } from "../../../supabaseCalls/accountSupabaseCalls";
import { LevelThreeScreenContext } from "../../contexts/levelThreeScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";

import UserProfileScreenView from "./userProfile";

type UserProfileProps = {
  closeParallax?: (mapConfig: number) => void
  bottomHitCount?: number;
};

export default function UserProfileScreen({ closeParallax }: UserProfileProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { selectedProfile } = useContext(SelectedProfileContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setLevelThreeScreen } = useContext(
    LevelThreeScreenContext
  );
  const [profilePhotos, setProfilePhotos] = useState(null);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);

  useEffect(() => {
    getData(selectedProfile);
  },[selectedProfile]);

  const getData = async(selectedProfile: ActiveProfile) => {
    const species = await getUserSpeciesCount(selectedProfile.UserID);
    setSpeciesCount(species.distinct_label_count);

    const sightings = await getUserSightingsCount(selectedProfile.UserID);
    setSightingsCount(sightings.label_count);
    const recentNine = await getDiveSiteRecentNinePhotos(selectedProfile.UserID);
    setProfilePhotos(recentNine);
  };

  const handleDiveSiteMove = async(pic: Photo, photoPacket) => {
    setSelectedDiveSite({
      SiteName: photoPacket.name,
      Latitude: pic.latitude,
      Longitude: pic.longitude
    });
    closeParallax(1);
    setLevelTwoScreen(false);
  };

  const openAllPhotosPage = () => {
    setLevelThreeScreen(true);
    setActiveScreen("UserProfilePhotos");
  };

  return (
    <UserProfileScreenView
      profilePhotos={profilePhotos}
      selectedProfile={selectedProfile}
      handleDiveSiteMove={handleDiveSiteMove}
      speciesCount={speciesCount}
      sightingsCount={sightingsCount}
      openAllPhotosPage={openAllPhotosPage}
      setLevelThreeScreen={setLevelThreeScreen}
    />
  );

}