import React, {useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteScreen from './diveSite';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from '../../png/NoImage.png';
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { UserProfileContext } from "../../contexts/userProfileContext";
import IconWithLabel from "../../reusables/iconWithLabal";
import { PinContext } from "../../contexts/staticPinContext";
import { ActiveScreenContext } from "../../contexts/activeScreenContext";
import { PreviousButtonIDContext } from "../../contexts/previousButtonIDContext";
import { useTranslation } from "react-i18next";
import { useButtonPressHelper } from "../../FABMenu/buttonPressHelper";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";


type DiveSiteProps = {
  siteID: number
};

export default function DiveSiteParallax(props: DiveSiteProps) {
  const { t } = useTranslation();
  const { profile } = useContext(UserProfileContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [diveSiteVals, setDiveSiteVals] = useState(null);
  const [isPartnerAccount, setIsPartnerAccount] = useState(false);
  const { pinValues, setPinValues } = useContext(PinContext);
  // const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);


  const [selectedDiveSite, setSelectedDiveSite] = useState<DiveSiteWithUserName | null>(null)

  useEffect(() => {

    getDiveSiteinfo()

    if (profile[0]?.partnerAccount) {
      setIsPartnerAccount(true);
    }
  }, [props.siteID]);


  const getDiveSiteinfo = async () => {
    const diveSiteinfo = await getDiveSiteById(props.siteID)
    setSelectedDiveSite(diveSiteinfo[0])
  }

  useEffect(() => {
    let photoName = null;
    if(selectedDiveSite?.divesiteprofilephoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedDiveSite.divesiteprofilephoto.split("/").pop()}`;
    }

    setDiveSiteVals({
      id: selectedDiveSite?.id,
      bio: selectedDiveSite?.divesitebio,
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
    setPinValues({
      ...pinValues,
      Latitude: String(selectedDiveSite.lat),
      Longitude: String(selectedDiveSite.lng),
      siteName: selectedDiveSite.name,
    });

    setActiveScreen("PictureUploadScreen", {id: selectedDiveSite})
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

      <DiveSiteScreen onMapFlip={onNavigate} isMyShop={isPartnerAccount} selectedDiveSite={selectedDiveSite}/>
    </ParallaxDrawer>
  );
}
