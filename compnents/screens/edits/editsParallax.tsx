import React, { useContext, useEffect, useState } from "react";

import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import noImage from "../../png/NoImage.png";
import { chooseImageHandler } from "../imageUploadHelpers";
import IconWithLabel from "../../reusables/iconWithLabal";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";

import EdittingScreen from ".";

export type BasicFormData = {
  dataType: string
  title: string
  id: number
  name: string
  bio: string
  uri: string
  placeholderName: string
  placeholderBio: string
}

export default function EditScreenParallax() {
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { activeTutotialID, setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { editInfo } = useContext(EditsContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { selectedShop } = useContext(SelectedShopContext);
  const { selectedProfile } = useContext(SelectedProfileContext);

  const [localPreviewUri, setLocalPreviewUri] = useState(null);
  const [initialFormData, setInitialFormData] = useState<BasicFormData | null>(null);

  useEffect(() => {
    switch(editInfo) {
      case "DiveSite":
        setLocalPreviewUri(selectedDiveSite.diveSiteProfilePhoto ? {uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedDiveSite.diveSiteProfilePhoto.split("/").pop()}`} : noImage)
        setInitialFormData({ 
          dataType: "Dive Site",
          title: "Dive Site Edit",
          id: selectedDiveSite.id,
          name: selectedDiveSite.name,
          bio: selectedDiveSite.diveSiteBio,
          uri: selectedDiveSite.diveSiteProfilePhoto,
          placeholderName: "Dive Site Name cannot be blank!",
          placeholderBio: `A little about ${selectedDiveSite.name}`
        })
        break;
      case "DiveShop":
        setLocalPreviewUri(selectedShop.diveShopProfilePhoto ? {uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedShop.diveShopProfilePhoto.split("/").pop()}`} : noImage)
        setInitialFormData({ 
          dataType: "Dive Center",
          title: "Dive Center Edit",
          id: selectedShop.id,
          name: selectedShop.orgName,
          bio: selectedShop.diveShopBio,
          uri: selectedShop.diveShopProfilePhoto,
          placeholderName: "Dive Centre Name cannot be blank!",
          placeholderBio: `A little about ${selectedShop.orgName}`
        })
        break;
      case "Profile":
        setLocalPreviewUri(selectedProfile.profilePhoto ? {uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedProfile.profilePhoto.split("/").pop()}`} : noImage)
        setInitialFormData({ 
          dataType: "Profile",
          title: "Edit My Profile",
          id: selectedProfile.id,
          name: selectedProfile.UserName,
          bio: selectedProfile.profileBio,
          uri: selectedProfile.profilePhoto,
          placeholderName: "You Diver Name cannot be blank!",
          placeholderBio: "Tell other divers about yourself"
        })
        break;
    } 
  },[selectedDiveSite, selectedShop, selectedProfile, editInfo, activeTutotialID])


  const onClose = async() => {
    setFullScreenModal(false);
    setActiveTutorialID(null);
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
  
  const handleSelectImage = async() => {
    try {
      const result = await chooseImageHandler();
      if (result?.assets?.[0]?.uri) {
        handleImageUpload(result?.assets?.[0]?.uri)
      }
    } catch (e: any) {
      console.log("Image selection cancelled", e.message);
    }
  };
  
  const handleImageUpload = async(argPicture) => {
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
        setLocalPreviewUri={setLocalPreviewUri}
        localPreviewUri={localPreviewUri}
        initialFormData={initialFormData}
      />
    </ParallaxDrawer>
  );
}
