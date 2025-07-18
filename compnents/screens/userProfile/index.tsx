import React, { useContext, useEffect, useState } from "react";

import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { Photo } from "../../../entities/photos";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ActiveProfile } from "../../../entities/profile";
import { getDiveSiteRecentNinePhotos, getUserSightingsCount, getUserSpeciesCount } from "../../../supabaseCalls/accountSupabaseCalls";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

import UserProfileScreenView from "./userProfile";

type UserProfileProps = {
  closeParallax?: (mapConfig: number) => void
  bottomHitCount?: number;
};

export default function UserProfileScreen({ closeParallax }: UserProfileProps) {
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { selectedProfile, setSelectedProfile } = useContext(SelectedProfileContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

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

    console.log(selectedProfile)
    const recentNine = await getDiveSiteRecentNinePhotos(selectedProfile.UserID);
    console.log('recentNine', recentNine)
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
    setFullScreenModal(true);
    setActiveTutorialID("UserProfilePhotos");
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