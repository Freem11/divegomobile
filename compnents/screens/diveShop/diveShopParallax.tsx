import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";

import noImage from "../../png/NoImage.png";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { getDiveShopById } from "../../../supabaseCalls/shopsSupabaseCalls";
import IconWithLabel from "../../reusables/iconWithLabal";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { EditsContext } from "../../contexts/editsContext";
import { useMapStore } from "../../googleMap/useMapStore";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { MapConfigurations } from "../../googleMap/types";
import { EDIT_TYPE } from "../../../entities/editTypes";

import { useDiveShopNavigation } from "./types";

import DiveShopScreen from ".";

type DiveShopParallaxProps = {
  id: number;
};

export default function DiveShopParallax(props: DiveShopParallaxProps) {
  const diveShopNavigation = useDiveShopNavigation();
  const { t } = useTranslation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);

  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const [diveShopVals, setDiveShopVals] = useState(null);
  const { userProfile } = useUserProfile();
  const [isMyShop, setIsMyShop] = useState(false);

  const { setEditInfo } = useContext(EditsContext);

  useEffect(() => {
    getDiveSiteinfo();
  }, [props.id]);

  const getDiveSiteinfo = async () => {
    const diveCentreinfo = await getDiveShopById(props.id);
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
    diveShopNavigation.goBack();
  };

  //Needs Navigator
  const onNavigate = () => {
    Keyboard.dismiss();
    setMapConfig(MapConfigurations.TripView, { pageName: "DiveShop", itemId: selectedShop.id });
  };

  const openTripCreatorScreen = () => {
    diveShopNavigation.navigate("TripCreator", { id: null, subTitle: "New Trip", shopId: selectedShop.id });
  };

  const openEditsPage = () => {
    diveShopNavigation.navigate("EditScreen", { id: selectedShop.id, dataType: EDIT_TYPE.DIVE_CENTRE });
    setEditInfo("DiveShop");
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