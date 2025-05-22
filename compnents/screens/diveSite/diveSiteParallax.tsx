import React, {useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteScreen from './diveSite';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from '../../png/NoImage.jpg';
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


export default function DiveSiteParallax() {
  const { t } = useTranslation();
  const { profile } = useContext(UserProfileContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [diveSiteVals, setDiveSiteVals] = useState(null);
  const [isPartnerAccount, setIsPartnerAccount] = useState(false);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);

  useEffect(() => {
    if (profile[0].partnerAccount) {
      setIsPartnerAccount(true);
    }
  }, []);

  useEffect(() => {
    let photoName = null;
    if(selectedDiveSite.diveSiteProfilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedDiveSite.diveSiteProfilePhoto.split("/").pop()}`;
    }

    setDiveSiteVals({
      id: selectedDiveSite.id,
      bio: selectedDiveSite.diveSiteBio,
      photo: photoName,
    });

  }, [selectedDiveSite]);

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {

        let fileName = await imageUpload(image)

        if (diveSiteVals.photo !== null || diveSiteVals.photo === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: diveSiteVals.photo.split("/").pop(),
          });
        }

        setDiveSiteVals({
          ...diveSiteVals,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveShop({
          id: diveSiteVals.id,
          bio: diveSiteVals.bio,
          photo: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };
  
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
    setLevelOneScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("PictureUploadScreen");
    useButtonPressHelper(
      "PictureUploadScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };

  const openEditsPage = () => {
    setEditInfo('DiveSite')
    setActiveTutorialID("EditsScreen")
  };

  const popoverConent = () => {
    return (
    <>
    {isPartnerAccount &&
      <IconWithLabel 
      label="Change Header Image"
      iconName="camera-flip-outline"
      buttonAction={() => handleImageUpload()}
      />}
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

      <DiveSiteScreen onMapFlip={onNavigate} isMyShop={isPartnerAccount}/>
    </ParallaxDrawer>
  );
}
