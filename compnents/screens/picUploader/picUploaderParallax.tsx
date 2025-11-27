import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteProp, useRoute } from "@react-navigation/native";

import Button from "../../reusables/button";
import IconWithLabel from "../../reusables/iconWithLabal";
import { chooseImageHandler } from "../imageUploadHelpers";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { DiveSiteRoutes } from "../diveSite/diveSiteNavigator";
import { useDiveSiteNavigation } from "../diveSite/types";

import * as S from "./styles";

import PicUploader from ".";

type PicUploaderRouteProps = RouteProp<DiveSiteRoutes, "AddSighting">;

export default function PicUploaderParallax() {
  const diveSiteNavigation = useDiveSiteNavigation();
  const route = useRoute<PicUploaderRouteProps>();
  const { selectedDiveSite } = route.params;
  const { t } = useTranslation();;
  const [localPreviewUri, setLocalPreviewUri] = useState(null);

  const onClose = async () => {
    diveSiteNavigation.goBack();
  };

  const handleSelectImage = async () => {
    try {
      const result = await chooseImageHandler();
      if (result?.assets?.[0]?.uri) {
        handleImageUpload(result?.assets?.[0]?.uri);
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };

  const handleImageUpload = async (argPicture: string) => {
    setLocalPreviewUri({ uri: argPicture });
  };

  const popoverContent = () => {
    return (
      <>
        <IconWithLabel
          label="Change Header Image"
          iconName="camera-flip-outline"
          buttonAction={() => handleSelectImage()}
        />
      </>
    );
  };

  const imageUploadZone = () => {
    return (
      <S.UploadZone>
        <Button
          onPress={() => handleSelectImage()}
          size="large"
          title={t("PicUploader.uploadButton")}
          alt={true}
        />
      </S.UploadZone>
    );
  };

  return (
    <ParallaxDrawer
      headerImage={localPreviewUri ? localPreviewUri : imageUploadZone}
      onClose={onClose}
      popoverContent={localPreviewUri && popoverContent}
      isMyShop={localPreviewUri}
    >
      <PicUploader
        onClose={onClose}
        localPreviewUri={localPreviewUri}
        setLocalPreviewUri={setLocalPreviewUri}
        selectedDiveSite={selectedDiveSite}
      />
    </ParallaxDrawer>
  );
}
