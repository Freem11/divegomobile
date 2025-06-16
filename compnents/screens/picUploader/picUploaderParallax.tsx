import React, { useContext, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import PicUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { PinContext } from "../../contexts/staticPinContext";
import { Keyboard } from "react-native";
import { chooseImageHandler } from "../imageUploadHelpers";
import IconWithLabel from "../../reusables/iconWithLabal";
import * as S from "./styles";
import Button from "../../reusables/button";
import { useTranslation } from "react-i18next";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { useMapStore } from "../../googleMap/useMapStore";

type PicUploaderProps = {
  selectedDiveSite: DiveSiteWithUserName
};

export default function PicUploaderParallax(props: PicUploaderProps) {
  const { t } = useTranslation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const [localPreviewUri, setLocalPreviewUri] = useState(null);
  
  const onClose = async () => {
    setLevelTwoScreen(false);
      setPinValues({
        ...pinValues,
        PicFile: null,
        Animal: "",
        PicDate: "",
        Latitude: "",
        Longitude: "",
        DDVal: "0",
      });
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapConfig(1, 0);
    setLevelTwoScreen(false);
  };

  const handleSelectImage = async () => {
    try {
      const result = await chooseImageHandler();
      if (result?.assets?.[0]?.uri) {
        handleImageUpload(result?.assets?.[0]?.uri)
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };
  
  const handleImageUpload = async (argPicture) => {
    setLocalPreviewUri({uri: argPicture});
  };
  
  const popoverConent = () => {
    return (
    <>
    <IconWithLabel 
    label="Change Header Image"
    iconName="camera-flip-outline"
    buttonAction={() => handleSelectImage()}
    />
    </>
    )
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
    )
  };

  return (
    <ParallaxDrawer 
    headerImage={localPreviewUri ? localPreviewUri : imageUploadZone} 
    onClose={onClose} 
    popoverConent={localPreviewUri && popoverConent}
    isMyShop={localPreviewUri}
    >
      <PicUploader 
          onClose={onClose}
          localPreviewUri={localPreviewUri}
          setLocalPreviewUri={setLocalPreviewUri}
          selectedDiveSite={props.selectedDiveSite}
          />
    </ParallaxDrawer>
  );
}
