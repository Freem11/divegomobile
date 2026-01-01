import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getDiveSitePhotos } from "../../../supabaseCalls/photoSupabaseCalls";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { grabProfileByUserName } from "../../../supabaseCalls/accountSupabaseCalls";
import { ActiveProfile } from "../../../entities/profile";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { useDiveSiteNavigation } from "../diveSite/types";
import { useAppNavigation } from "../../mapPage/types";
import { getSingleDiveSite } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { Photo } from "../../../entities/photos";

import DiveSitePhotosPageView from "./divesitePhotos";

export default function DiveSitePhotosPage() {
  const { userProfile } = useUserProfile();
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const diveSiteNavigation = useDiveSiteNavigation();
  const mainNavigation = useAppNavigation();

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

    mainNavigation.navigate("UserProfile", { id: picOwnerAccount[0].id });
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