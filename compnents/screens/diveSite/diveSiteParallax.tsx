import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";
import email from "react-native-email";
import { useNavigation } from "@react-navigation/native";

import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from "../../png/NoImage.png";
import IconWithLabel from "../../reusables/iconWithLabal";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { getDiveSiteById } from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { useMapStore } from "../../googleMap/useMapStore";

import { useDiveSiteNavigation } from "./types";

import DiveSiteScreen from "./index";

type DiveSiteParallaxProps = {
  id: number;
};
export default function DiveSiteParallax(props: DiveSiteParallaxProps) {
  // const route = useRoute<DiveSiteRouteProp>();
  const navigation = useNavigation();
  const diveSiteNavigation = useDiveSiteNavigation();
  // const { id } = route.params;
  const { t } = useTranslation();
  const { userProfile } = useUserProfile();

  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const [diveSiteVals, setDiveSiteVals] = useState(null);
  const [isPartnerAccount, setIsPartnerAccount] = useState(false);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);

  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { setChosenModal } = useContext(ModalSelectContext);
  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  const { selectedDiveSite, setSelectedDiveSite } = useContext(SelectedDiveSiteContext);

  useEffect(() => {
    getDiveSiteinfo();
    if (userProfile?.partnerAccount) {
      setIsPartnerAccount(true);
    }
  }, [props.id]);

  const getDiveSiteinfo = async () => {
    if (props.id) {
      const diveSiteinfo = await getDiveSiteById(props.id);
      setSelectedDiveSite(diveSiteinfo[0]);
    }
  };

  useEffect(() => {
    let photoName = null;
    if (selectedDiveSite?.divesiteprofilephoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedDiveSite.divesiteprofilephoto.split("/").pop()}`;
    }

    setDiveSiteVals({
      id: selectedDiveSite?.id,
      bio: selectedDiveSite?.divesitebio,
      photo: photoName,
    });

  }, [selectedDiveSite]);

  const onClose = async () => {
    navigation.goBack();
    // navigation.navigate("BottomTab");
    // setLevelOneScreen(false);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setChosenModal("DiveSite");
    setMapConfig(2, { pageName: "DiveSite", itemId: selectedDiveSite.id });
    setLevelOneScreen(false);
  };

  const openPicUploader = () => {
    diveSiteNavigation.navigate("AddSighting", { selectedDiveSite });
  };

  const openEditsPage = () => {
    diveSiteNavigation.navigate("EditScreen");
    setEditInfo("DiveSite");
  };

  const handleReport = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with Dive Site: "${selectedDiveSite.name}" at Latitude: ${selectedDiveSite.lat} Longitude: ${selectedDiveSite.lng} `,
      body: "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordinates are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const popoverContent = () => {
    return (
      <>
        {isPartnerAccount && (
          <IconWithLabel
            label="Update Dive Site Info"
            iconName="camera-flip-outline"
            buttonAction={() => openEditsPage()}
          />
        )}
        <IconWithLabel
          label={t("DiveSite.addSighting")}
          iconName="camera-plus"
          buttonAction={() => openPicUploader()}
        />
        <IconWithLabel
          label={t("DiveSite.report")}
          iconName="flag"
          buttonAction={() => handleReport()}
        />
      </>
    );
  };

  return (
    <ParallaxDrawer
      headerImage={diveSiteVals && diveSiteVals.photo ? { uri: diveSiteVals.photo } : noImage}
      onClose={onClose}
      onMapFlip={onNavigate}
      popoverContent={popoverContent}
      isMyShop={isPartnerAccount}
    >
      <DiveSiteScreen
        selectedDiveSite={selectedDiveSite}
        openPicUploader={openPicUploader}
      />
    </ParallaxDrawer>
  );
}
