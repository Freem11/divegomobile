import React, { useContext, useEffect, useState } from "react";
import email from "react-native-email";

import { Pagination } from "../../../entities/pagination";
import { getDiveSitePhotos, getDiveSiteSightingCount, getDiveSiteSpeciesCount, getDiveSiteSRecetnNinePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { grabProfileByUserName } from "../../../supabaseCalls/accountSupabaseCalls";
import { getDiveSiteTripCount, getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";

import DiveSiteScreenView from "./diveSite";

type DiveSiteProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
  selectedDiveSite: DiveSiteWithUserName;
  bottomHitCount?: number;
};

export default function DiveSiteScreen({
  closeParallax,
  restoreParallax,
  selectedDiveSite,
  bottomHitCount
}: DiveSiteProps) {

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { profile } = useContext(UserProfileContext);
  const [diveSitePics, setDiveSitePics] = useState([]);
  const [diveSiteTrips, setDiveSiteTrips] = useState([]);
  const [previewSightings, setPreviewSightings] = useState([]);
  const [sightingsCount, setSightingsCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);

  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const getPhotos = async(site, profile) => {

    const pagination = new Pagination({page: bottomHitCount, ipp: 10})
   
    const photos = await getDiveSitePhotos(
      site.lat,
      site.lng,
      profile.UserID,
      pagination
    );

    setDiveSitePics((prev) => prev ? [...prev, ...photos] : photos);
  };

  const getTrips = async(diveSiteId: number) => {
    const data = await getItinerariesForDiveSite(diveSiteId)
    setDiveSiteTrips(data)
  }


  useEffect(() => {
    getTrips(selectedDiveSite.id)
  },[selectedDiveSite])


  useEffect(() => {
    if(selectedDiveSite){
      newStuff(selectedDiveSite)
    }

  },[])

  const newStuff = async(selectedDiveSite: DiveSiteWithUserName) => {
    const tripCount = await getDiveSiteTripCount(selectedDiveSite.id)
    const speciesCount = await getDiveSiteSpeciesCount({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})
    const sightingsCount = await getDiveSiteSightingCount({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})
    const recentNine = await getDiveSiteSRecetnNinePhotos({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})

    console.log("tripCount", tripCount)

    setSightingsCount(sightingsCount.label_count);
    setSpeciesCount(speciesCount.distinct_label_count)
    setPreviewSightings(recentNine);
  }
  
  useEffect(() => {
    if (selectedDiveSite.lat && profile) {
      getPhotos(selectedDiveSite, profile);
    }
  }, [selectedDiveSite, profile, bottomHitCount]);
  
  
  const handleProfileMove = async(userName: string) => {
    const picOwnerAccount = await grabProfileByUserName(userName);

    if (profile.UserID === picOwnerAccount[0].UserID) {
      return;
    }

    setActiveScreen("ProfileScreen", {id: picOwnerAccount[0].id})
    setLevelOneScreen(false);
    setLevelTwoScreen(true);
  };

  return (
    <DiveSiteScreenView
      selectedDiveSite={selectedDiveSite}
      diveSitePics={previewSightings}
      handleProfileMove={handleProfileMove}
      sightingsCount={sightingsCount}
      speciesCount={speciesCount}
    />
  )

}