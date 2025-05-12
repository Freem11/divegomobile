import React, { useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import DiveSiteScreen from './diveSite';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from '../../png/NoImage.jpg';
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";

export default function DiveSiteParallax() {
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [diveSiteVals, setDiveSiteVals] = useState(null);
  const [isMyShop, setIsMyShop] = useState(false);

  useEffect(() => {
    let photoName = null;
    if(selectedDiveSite.diveSiteProfilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedDiveSite.diveSiteProfilePhoto.split("/").pop()}`;
    }

    setDiveSiteVals({
      id: selectedDiveSite.id,
      bio: selectedDiveSite.diveSiteBio,
      photo: photoName,
    });

  }, [selectedDiveSite]);

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {

        let fileName = await imageUpload(image)

        if (diveSiteVals.photo !== null || diveSiteVals.photo === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: diveSiteVals.photo.split("/").pop(),
          });
        }

        setDiveSiteVals({
          ...diveSiteVals,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveShop({
          id: diveSiteVals.id,
          bio: diveSiteVals.bio,
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
    // setChosenModal("DiveSite");
    // setMapHelper(true);
    // setMapConfig(2);
    setLevelOneScreen(false);
  };

  return (
    <ParallaxDrawer 
      headerImage={diveSiteVals && diveSiteVals.photo ? { uri: diveSiteVals.photo } : noImage} 
      onClose={onClose} 
      onMapFlip={onNavigate}
      handleImageUpload={handleImageUpload}
      isMyShop={isMyShop}
      >
      <DiveSiteScreen onMapFlip={onNavigate}/>
    </ParallaxDrawer>
  );
}
