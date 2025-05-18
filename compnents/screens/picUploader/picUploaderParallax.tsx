import React, { useContext, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import PicUploader from ".";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { PinContext } from "../../contexts/staticPinContext";
import boatImage from "../../png/boat.png";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { imageUpload } from "../imageUploadHelpers";


export default function PicUploaderParallax() {
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

  const handleImageUpload = async (argPicture) => {
    setPinValues({
      ...pinValues,
      PicFile: `animalphotos/public/${argPicture}`,
    });
    setLocalPreviewUri(argPicture);
  };
  
  return (
    <ParallaxDrawer 
    headerImage={boatImage} 
    onClose={onClose} 
    onMapFlip={onNavigate}
    handleImageUpload={() => handleImageUpload}
    isMyShop={localPreviewUri}
    >
      <PicUploader 
          onClose={onClose}
          onMapFlip={onNavigate}
          handleImageUpload={() => handleImageUpload}
          localPreviewUri={localPreviewUri}
          setLocalPreviewUri={setLocalPreviewUri}
          />
    </ParallaxDrawer>
  );
}
