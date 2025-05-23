import React, { useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import EdittingScreen from ".";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import noImage from '../../png/NoImage.jpg';
import { chooseImageHandler } from "../imageUploadHelpers";
import IconWithLabel from "../../reusables/iconWithLabal";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { EditsContext } from "../../contexts/editsContext";

export type BasicFormData = {
  dataType: string
  title: string
  id: number
  name: string
  bio: string
}

export default function EditScreenParallax() {
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { editInfo } = useContext(EditsContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { selectedShop } = useContext(SelectedShopContext);
  
  const [localPreviewUri, setLocalPreviewUri] = useState(null);
  const [initialFormData, setInitialFormData] = useState<BasicFormData | null>(null);

console.log('selectedDiveSite', selectedDiveSite)
console.log('selectedShop', selectedShop)
console.log('editInfo', editInfo)

useEffect(() => {
  switch(editInfo) {
    case "DiveSite":
      setLocalPreviewUri(selectedDiveSite.diveSiteProfilePhoto ? {uri: selectedDiveSite.diveSiteProfilePhoto} : noImage)
      setInitialFormData({ 
        dataType: "DiveSite",
        title: "Dive Site Edit",
        id: selectedDiveSite.id,
        name: selectedDiveSite.name,
        bio: selectedDiveSite.diveSiteBio
      })
      break;
    case "DiveShop":
      setLocalPreviewUri(selectedShop[0].diveShopProfilePhoto ? {uri: selectedShop[0].diveShopProfilePhoto} : noImage)
      setInitialFormData({ 
        dataType: "DiveSite",
        title: "Dive Center Edit",
        id: selectedShop[0].id,
        name: selectedShop[0].orgName,
        bio: selectedShop[0].diveShopBio
      })
      break;
    case "Profile":
      // setLocalPreviewUri()
      // setInitialFormData()
      break;
  } 
},[selectedDiveSite, selectedShop, editInfo])




  const onClose = async () => {
    setFullScreenModal(false);
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

  return (
    <ParallaxDrawer 
      headerImage={localPreviewUri ? localPreviewUri : noImage} 
      onClose={onClose}
      popoverConent={popoverConent}
      >
      <EdittingScreen 
          onClose={onClose}
          localPreviewUri={localPreviewUri}
          initialFormData={initialFormData}
          />
    </ParallaxDrawer>
  );
}
