import React, { useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveShopScreen from '.';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from '../../png/NoImage.png';
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { getDiveShopById } from "../../../supabaseCalls/shopsSupabaseCalls";
import { UserProfileContext } from "../../contexts/userProfileContext";
import IconWithLabel from "../../reusables/iconWithLabal";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useTranslation } from "react-i18next";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { useMapStore } from '../../googleMap/useMapStore';

type DiveCentreProps = {
  shopID: number
};

export default function DiveShopParallax(props: DiveCentreProps) {
  const { t } = useTranslation();
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [diveShopVals, setDiveShopVals] = useState(null);
  const { profile } = useContext(UserProfileContext);
  const [isMyShop, setIsMyShop] = useState(false);

  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  
  useEffect(() => {
    getDiveSiteinfo()
  }, [props.shopID]);


  const getDiveSiteinfo = async () => {
    const diveCentreinfo = await getDiveShopById(props.shopID)
    setSelectedShop(diveCentreinfo[0])
  }

  useEffect(() => {
    if (
      profile.partnerAccount &
      (selectedShop.userId === profile.UserID)
    ) {
      setIsMyShop(true);
    } else {
      setIsMyShop(false);
    }

    let photoName = null;
    if(selectedShop.diveShopProfilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedShop.diveShopProfilePhoto.split("/").pop()}`;
    }
    
    setDiveShopVals({
      id: selectedShop.id,
      bio: selectedShop.diveShopBio,
      photo: photoName,
    });

  }, [selectedShop]);
  
  const onClose = async () => {
    setLevelOneScreen(false);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setChosenModal("DiveSite");
    setMapConfig(2, selectedShop.id);
    setLevelOneScreen(false);
  };

  const openTripCreatorScreen = () => {
    setLevelOneScreen(false);
    setLevelTwoScreen(true);
    setActiveScreen("TripCreatorScreen");
  };
  
  const openEditsPage = () => {
    setFullScreenModal(true)
    setEditInfo('DiveShop')
    setActiveTutorialID("EditsScreen")
  };

  const popoverConent = () => {
    return (
    <>
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
      <DiveShopScreen isMyShop={isMyShop} selectedShop={selectedShop}/>
    </ParallaxDrawer>
  );
}