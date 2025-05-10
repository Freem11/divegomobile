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
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { UserProfileContext } from "../../contexts/userProfileContext";

export default function DiveShopParallax() {
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { selectedShop } = useContext(SelectedShopContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [diveShopVals, setDiveShopVals] = useState(null);
  const { profile } = useContext(UserProfileContext);
  const [isMyShop, setIsMyShop] = useState(false);
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

  return (
    <ParallaxDrawer 
      headerImage={diveShopVals && diveShopVals.photo ? { uri: diveShopVals.photo } : mantaImage} 
      onClose={onClose} 
      onMapFlip={onNavigate}
      handleImageUpload={handleImageUpload}
      isMyShop={isMyShop}
      >
      <DiveShopScreen onMapFlip={onNavigate} isMyShop={isMyShop}/>
    </ParallaxDrawer>
  );
}
