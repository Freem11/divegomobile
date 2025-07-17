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
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

type DiveSiteProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
  selectedDiveSite: DiveSiteWithUserName;
  bottomHitCount?: number;
  openPicUploader: () => void;
};

export default function DiveSiteScreen({
  closeParallax,
  restoreParallax,
  selectedDiveSite,
  bottomHitCount,
  openPicUploader
}: DiveSiteProps) {

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { profile } = useContext(UserProfileContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const [diveSitePics, setDiveSitePics] = useState([]);;
  const [tripCount, setTripCount] = useState(0);
  const [speciesCount, setSpeciesCount] = useState(0);
  const [sightingsCount, setSightingsCount] = useState(0);

  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const openAllPhotosPage = () => {
    setFullScreenModal(true)
    //to do: need to change what modal animation this runs on
    setActiveTutorialID("DiveSitePhotos")
  };

  const openAllTripsPage = () => {
    setFullScreenModal(true)
    //to do: need to change what modal animation this runs on
    setActiveTutorialID("DiveSiteTrips")
  };

  useEffect(() => {
    if(selectedDiveSite){
      newStuff(selectedDiveSite)
    }
  },[selectedDiveSite])

  const newStuff = async (selectedDiveSite: DiveSiteWithUserName) => {

  const trips = await getDiveSiteTripCount(selectedDiveSite.id)
  setTripCount(trips.label_count)

  const species = await getDiveSiteSpeciesCount({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})
  setSpeciesCount(species.distinct_label_count)

  const sightings = await getDiveSiteSightingCount({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})
  setSightingsCount(sightings.label_count)

  let recentNine = await getDiveSiteSRecetnNinePhotos({lat: selectedDiveSite.lat, lng: selectedDiveSite.lng})
  // console.log('recentNine', recentNine)
  }
  
  // useEffect(() => {
  //   if (selectedDiveSite.lat && profile) {
  //     getPhotos(selectedDiveSite, profile);
  //   }
  // }, [selectedDiveSite, profile, bottomHitCount]);
  
  
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
        handleEmailDS={handleEmailDS}
        speciesCount={speciesCount}
        sightingsCount={sightingsCount}
        tripCount={tripCount}
        openPicUploader={openPicUploader}
        openAllPhotosPage={openAllPhotosPage}
        openAllTripsPage={openAllTripsPage}
    />
  )

}
