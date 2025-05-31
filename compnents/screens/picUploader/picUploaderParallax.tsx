import React, { useContext, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import PicUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { PinContext } from "../../contexts/staticPinContext";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { chooseImageHandler } from "../imageUploadHelpers";
import IconWithLabel from "../../reusables/iconWithLabal";
import * as S from "./styles";
import Button from "../../reusables/button";
import { useTranslation } from "react-i18next";

export default function PicUploaderParallax() {
  const { t } = useTranslation();
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
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
    setChosenModal("DiveSite");
    setMapHelper(true);
    setMapConfig(1);
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
    onMapFlip={onNavigate}
    popoverConent={localPreviewUri && popoverConent}
    isMyShop={localPreviewUri}
    >
      <PicUploader 
          onClose={onClose}
          onMapFlip={onNavigate}
          localPreviewUri={localPreviewUri}
          setLocalPreviewUri={setLocalPreviewUri}
          />
    </ParallaxDrawer>
  );
}
