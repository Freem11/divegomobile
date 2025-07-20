import React, { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { useTranslation } from "react-i18next";

import DiveSitePhotosPageView from "./divesitePhotos";
import { getDiveSitePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { grabProfileByUserName } from "../../../supabaseCalls/accountSupabaseCalls";
import { LevelThreeScreenContext } from "../../contexts/levelThreeScreenContext";

type DiveSitePhotosPageProps = {};

export default function DiveSitePhotosPage({}: DiveSitePhotosPageProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setLevelThreeScreen } = useContext(
    LevelThreeScreenContext
  );
  const { profile } = useContext(UserProfileContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);


  const [diveSitePics, setDiveSitePics] = useState([]);

  const { t } = useTranslation();

    const getPhotos = async (site, profile) => {

    const photos = await getDiveSitePhotos(
      site.lat,
      site.lng,
      profile.UserID,
    );

    setDiveSitePics(photos);
  };

    
  const handleProfileMove = async (userName: string) => {
    const picOwnerAccount = await grabProfileByUserName(userName);

    if (profile.UserID === picOwnerAccount[0].UserID) {
      return;
    }

    setActiveScreen("ProfileScreen", {id: picOwnerAccount[0].id})
    setLevelThreeScreen(false);
    setLevelTwoScreen(true);
    setLevelOneScreen(false);
  };

    useEffect(() => {
    if (selectedDiveSite.lat && profile) {
      getPhotos(selectedDiveSite, profile);
    }
  }, [selectedDiveSite, profile]);
  
  return (
    <DiveSitePhotosPageView
      diveSites={diveSitePics}
      title={selectedDiveSite.name}
      setLevelThreeScreen={setLevelThreeScreen}
      handleProfileMove={handleProfileMove}
    />
  )

}