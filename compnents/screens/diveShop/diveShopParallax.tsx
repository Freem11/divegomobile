import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import { RouteProp, useRoute } from "@react-navigation/native";

import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from "../../png/NoImage.png";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { getDiveShopById } from "../../../supabaseCalls/shopsSupabaseCalls";
import IconWithLabel from "../../reusables/iconWithLabal";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { useMapStore } from "../../googleMap/useMapStore";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { MainRoutes } from "../../mapPage/mainNavigator";

import DiveShopScreen from ".";
import { useAppNavigation } from "../../mapPage/types";

type DiveCentreRouteProp = RouteProp<MainRoutes, "DiveCentre">;

export default function DiveShopParallax() {
  const route = useRoute<DiveCentreRouteProp>();
  const navigation = useAppNavigation();
  const { id } = route.params;
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
  const { userProfile } = useUserProfile();
  const [isMyShop, setIsMyShop] = useState(false);

  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  useEffect(() => {
    getDiveSiteinfo();
  }, [id]);

  const getDiveSiteinfo = async () => {
    const diveCentreinfo = await getDiveShopById(id);
    setSelectedShop(diveCentreinfo[0]);
  };

  useEffect(() => {
    if (
      userProfile &&
      userProfile?.partnerAccount &&
      (selectedShop.userId === userProfile.UserID)
    ) {
      setIsMyShop(true);
    } else {
      setIsMyShop(false);
    }

    let photoName = null;
    if (selectedShop.diveShopProfilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedShop.diveShopProfilePhoto.split("/").pop()}`;
    }

    setDiveShopVals({
      id: selectedShop.id,
      bio: selectedShop.diveShopBio,
      photo: photoName,
    });

  }, [selectedShop]);

  const onClose = async () => {
    navigation.goBack();
    // setLevelOneScreen(false);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setChosenModal("DiveSite");
    setMapConfig(2, { pageName: "DiveShop", itemId: selectedShop.id });
    setLevelOneScreen(false);
  };

  const openTripCreatorScreen = () => {
    setLevelOneScreen(false);
    setLevelTwoScreen(true);
    setActiveScreen("TripCreatorScreen");
  };

  const openEditsPage = () => {
    setFullScreenModal(true);
    setEditInfo("DiveShop");
    setActiveTutorialID("EditsScreen");
  };

  const popoverContent = () => {
    return (
      <>
        <IconWithLabel
          label="Update Shop Info"
          iconName="camera-flip-outline"
          buttonAction={() => openEditsPage()}
        />
        <IconWithLabel
          label={t("DiveShop.addTrip")}
          iconName="diving-scuba-flag"
          buttonAction={() => openTripCreatorScreen()}
        />
      </>
    );
  };

  return (
    <ParallaxDrawer
      headerImage={diveShopVals && diveShopVals.photo ? { uri: diveShopVals.photo } : noImage}
      onClose={onClose}
      onMapFlip={onNavigate}
      popoverContent={isMyShop && popoverContent}
      isMyShop={isMyShop}
    >
      <DiveShopScreen isMyShop={isMyShop} selectedShop={selectedShop} />
    </ParallaxDrawer>
  );
}