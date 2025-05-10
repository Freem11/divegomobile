import React, { useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveShopScreen from './diveShop';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import mantaImage from "../../png/blackManta.png";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { SelectedShopContext } from "../../contexts/selectedShopContext";

export default function DiveShopParallax() {
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { selectedShop } = useContext(SelectedShopContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [diveShopVals, setDiveShopVals] = useState(null);

  useEffect(() => {
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

  return (
    <ParallaxDrawer headerImage={diveShopVals && diveShopVals.photo ? { uri: diveShopVals.photo } : mantaImage} onClose={onClose} onMapFlip={onNavigate}>
      <DiveShopScreen onMapFlip={onNavigate}/>
    </ParallaxDrawer>
  );
}
