import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { getDiveSitePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { grabProfileByUserName } from "../../../supabaseCalls/accountSupabaseCalls";
import { LevelThreeScreenContext } from "../../contexts/levelThreeScreenContext";
import { ActiveProfile } from "../../../entities/profile";
import { useUserProfile } from "../../../store/user/useUserProfile";

import DiveSitePhotosPageView from "./divesitePhotos";
import { useDiveSiteNavigation } from "../diveSite/types";

type DiveSitePhotosPageProps = {};

export default function DiveSitePhotosPage({ }: DiveSitePhotosPageProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelThreeScreen } = useContext(
    LevelThreeScreenContext
  );
  const { userProfile } = useUserProfile();
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const diveSiteNavigation = useDiveSiteNavigation();

  const [diveSitePics, setDiveSitePics] = useState([]);

  const { t } = useTranslation();

  const getPhotos = async (site, userProfile: ActiveProfile) => {

    const photos = await getDiveSitePhotos(
      site.lat,
      site.lng,
      userProfile.UserID,
    );

    setDiveSitePics(photos);
  };

  const handleProfileMove = async (userName: string) => {
    const picOwnerAccount = await grabProfileByUserName(userName);

    if (userProfile.UserID === picOwnerAccount[0].UserID) {
      return;
    }

    setActiveScreen("ProfileScreen", { id: picOwnerAccount[0].id });
    setLevelThreeScreen(false);
    setLevelTwoScreen(true);
    setLevelOneScreen(false);
  };

  const onClose = async () => {
    diveSiteNavigation.goBack();
  };

  useEffect(() => {
    if (selectedDiveSite.lat && userProfile) {
      getPhotos(selectedDiveSite, userProfile);
    }
  }, [selectedDiveSite, userProfile]);

  return (
    <DiveSitePhotosPageView
      diveSites={diveSitePics}
      title={selectedDiveSite.name}
      onClose={onClose}
      handleProfileMove={handleProfileMove}
    />
  );

}