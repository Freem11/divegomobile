import React, { useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveShopScreen from './diveShop';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from '../../png/NoImage.jpg';
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { UserProfileContext } from "../../contexts/userProfileContext";
import IconWithLabel from "../../reusables/iconWithLabal";
import { useButtonPressHelper } from "../../FABMenu/buttonPressHelper";
import { ActiveScreenContext } from "../../contexts/activeScreenContext";
import { PreviousButtonIDContext } from "../../contexts/previousButtonIDContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useTranslation } from "react-i18next";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";

export default function DiveShopParallax() {
  const { t } = useTranslation();
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { selectedShop } = useContext(SelectedShopContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [diveShopVals, setDiveShopVals] = useState(null);
  const { profile } = useContext(UserProfileContext);
  const [isMyShop, setIsMyShop] = useState(false);

  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  
  useEffect(() => {
    if (
      profile[0].partnerAccount &
      (selectedShop[0].userId === profile[0].UserID)
    ) {
      setIsMyShop(true);
    } else {
      setIsMyShop(false);
    }

    let photoName = null;
    if(selectedShop[0].diveShopProfilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedShop[0].diveShopProfilePhoto.split("/").pop()}`;
    }
    
    setDiveShopVals({
      id: selectedShop[0].id,
      bio: selectedShop[0].diveShopBio,
      photo: photoName,
    });

  }, [selectedShop]);

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {

        let fileName = await imageUpload(image)

        if (diveShopVals.photo !== null || diveShopVals.photo === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: diveShopVals.photo.split("/").pop(),
          });
        }

        setDiveShopVals({
          ...diveShopVals,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveShop({
          id: diveShopVals.id,
          bio: diveShopVals.bio,
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
    setChosenModal("DiveSite");
    setMapHelper(true);
    setMapConfig(2);
    setLevelOneScreen(false);
  };

  const openTripCreatorScreen = () => {
    setLevelOneScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("TripCreatorScreen");
    useButtonPressHelper(
      "TripCreatorScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };
  
  const openEditsPage = () => {
    setEditInfo('DiveShop')
    setActiveTutorialID("EditsScreen")
  };

  const popoverConent = () => {
    return (
    <>
    <IconWithLabel 
    label="Change Header Image"
    iconName="camera-flip-outline"
    buttonAction={() => handleImageUpload()}
    />
    <IconWithLabel 
    label="Update Shop Info"
    iconName="camera-flip-outline"
    buttonAction={() => openEditsPage()}
    />
    <IconWithLabel 
    label={t('DiveShop.addTrip')}
    iconName="diving-scuba-flag"
    buttonAction={() => openTripCreatorScreen()}
    />
    </>
    )
  };

  return (
    <ParallaxDrawer 
      headerImage={diveShopVals && diveShopVals.photo ? { uri: diveShopVals.photo } : noImage} 
      onClose={onClose} 
      onMapFlip={onNavigate}
      popoverConent={isMyShop && popoverConent}
      isMyShop={isMyShop}
      >
      <DiveShopScreen onMapFlip={onNavigate} isMyShop={isMyShop}/>
    </ParallaxDrawer>
  );
}