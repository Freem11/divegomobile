import React, { useContext, useEffect, useState } from "react";
import DiveSiteScreenView from "./diveSite";
import { Pagination } from "../../../entities/pagination";
import { getDiveSitePhotos, getDiveSiteSightingCount, getDiveSiteSpeciesCount, getDiveSiteSRecetnNinePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { grabProfileByUserName } from "../../../supabaseCalls/accountSupabaseCalls";
import email from "react-native-email";
import { getDiveSiteTripCount, getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";

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

  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  
  const getPhotos = async (site, profile) => {

    const pagination = new Pagination({page: bottomHitCount, ipp: 10})
   
    const photos = await getDiveSitePhotos(
      site.lat,
      site.lng,
      profile.UserID,
      pagination
    );

    setDiveSitePics((prev) => prev ? [...prev, ...photos] : photos);
  };

  const getTrips = async (diveSiteId: number) => {
    const data = await getItinerariesForDiveSite(diveSiteId)
    setDiveSiteTrips(data)
  }


  useEffect(() => {
    getTrips(selectedDiveSite.id)
  },[selectedDiveSite])


  useEffect(() => {
    newStuff(selectedDiveSite)
  },[])

  const newStuff = async (selectedDiveSite: DiveSiteWithUserName) => {
  let tripCount = await getDiveSiteTripCount(selectedDiveSite.id)
  let speciesCount = await getDiveSiteSpeciesCount({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})
  let sightingsCount = await getDiveSiteSightingCount({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})

  let recentNine = await getDiveSiteSRecetnNinePhotos({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})

  console.log('tripCount', tripCount)

  console.log('speciesCount', speciesCount)

  console.log('sightingsCount', sightingsCount)

  console.log('recentNine', recentNine)
  }
  
  useEffect(() => {
    if (selectedDiveSite.lat && profile) {
      getPhotos(selectedDiveSite, profile);
    }
  }, [selectedDiveSite, profile, bottomHitCount]);
  
  
  const handleProfileMove = async (userName: string) => {
    const picOwnerAccount = await grabProfileByUserName(userName);

    if (profile.UserID === picOwnerAccount[0].UserID) {
      return;
    }

    setActiveScreen("ProfileScreen", {id: picOwnerAccount[0].id})
    setLevelOneScreen(false);
    setLevelTwoScreen(true);
  };

  const handleEmailDS = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with Dive Site: "${selectedDiveSite.name}" at Latitude: ${selectedDiveSite.lat} Longitude: ${selectedDiveSite.lng} `,
      body: "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordinates are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };
  
  return (
    <DiveSiteScreenView
        selectedDiveSite={selectedDiveSite}
        diveSitePics={diveSitePics}
        handleProfileMove={handleProfileMove}
        handleEmailDS={handleEmailDS}
    />
  )

}