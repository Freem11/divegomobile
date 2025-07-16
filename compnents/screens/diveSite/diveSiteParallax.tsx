import React, {useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteScreen from '.';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from '../../png/NoImage.png';
import { Keyboard } from "react-native";
import { UserProfileContext } from "../../contexts/userProfileContext";
import IconWithLabel from "../../reusables/iconWithLabal";
import { useTranslation } from "react-i18next";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";

type DiveSiteProps = {
  siteID: number
};

export default function DiveSiteParallax(props: DiveSiteProps) {
  const { t } = useTranslation();
  const { profile } = useContext(UserProfileContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const [diveSiteVals, setDiveSiteVals] = useState(null);
  const [isPartnerAccount, setIsPartnerAccount] = useState(false);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  const { selectedDiveSite, setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  
  useEffect(() => {

    getDiveSiteinfo()

    if (profile?.partnerAccount) {
      setIsPartnerAccount(true);
    }
  }, [props.siteID]);


  const getDiveSiteinfo = async () => {
    const diveSiteinfo = await getDiveSiteById(props.siteID)
    setSelectedDiveSite(diveSiteinfo[0])
  }

  useEffect(() => {
    let photoName = null;
    if(selectedDiveSite?.diveSiteProfilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedDiveSite.diveSiteProfilePhoto.split("/").pop()}`;
    }

    setDiveSiteVals({
      id: selectedDiveSite?.id,
      bio: selectedDiveSite?.diveSiteBio,
      photo: photoName,
    });

  }, [selectedDiveSite]);
  
  const onClose = async () => {
    setLevelOneScreen(false);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    // setChosenModal("DiveSite");
    // setMapHelper(true);
    // setMapConfig(2);
    setLevelOneScreen(false);
  };

  const openPicUploader = () => {
    setActiveScreen("PictureUploadScreen", selectedDiveSite)
    setLevelOneScreen(false);
    setLevelTwoScreen(true);
  };

  const openEditsPage = () => {
    setFullScreenModal(true)
    setEditInfo("DiveSite")
    setActiveTutorialID("EditsScreen")
  };

  const popoverConent = () => {
    return (
    <>
    {isPartnerAccount &&
      <IconWithLabel 
      label="Update Dive Site Info"
      iconName="camera-flip-outline"
      buttonAction={() => openEditsPage()}
      />}
    <IconWithLabel 
    label={t('DiveSite.addSighting')}
    iconName="camera-plus"
    buttonAction={() => openPicUploader()}
    />
    </>
    )
  };

  return (
    <ParallaxDrawer 
      headerImage={diveSiteVals && diveSiteVals.photo ? { uri: diveSiteVals.photo } : noImage} 
      onClose={onClose} 
      onMapFlip={onNavigate}
      popoverConent={popoverConent}
      isMyShop={isPartnerAccount}
      >

      <DiveSiteScreen 
      selectedDiveSite={selectedDiveSite}
      openPicUploader={openPicUploader}
      />
    </ParallaxDrawer>
  );
}
