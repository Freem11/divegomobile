import React, { useContext, useEffect, useState } from "react";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import UserProfileScreen from './userProfile';
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from '../../png/NoImage.png';
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { Keyboard } from "react-native";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { UserProfileContext } from "../../contexts/userProfileContext";
import IconWithLabel from "../../reusables/iconWithLabal";
import { useButtonPressHelper } from "../../FABMenu/buttonPressHelper";
import { ActiveScreenContext } from "../../contexts/activeScreenContext";
import { PreviousButtonIDContext } from "../../contexts/previousButtonIDContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useTranslation } from "react-i18next";
import { updateProfile } from "../../../supabaseCalls/accountSupabaseCalls";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { checkIfUserFollows, deleteUserFollow, insertUserFollow } from "../../../supabaseCalls/userFollowSupabaseCalls";
import { registerForPushNotificationsAsync } from "../../tutorial/notificationsRegistery";
import { SessionContext } from "../../contexts/sessionContext";

export default function UserProfileParallax() {
  const { t } = useTranslation();
  const { levelOneScreen, setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const [profileVals, setProfileVals] = useState(null);
  const { profile } = useContext(UserProfileContext);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const { activeSession } = useContext(SessionContext);
  
  const [isFollowing, setIsfFollowing] = useState<string | null>(null);

  useEffect(() => {
    if (
      (selectedProfile && selectedProfile[0].UserID === profile[0].UserID)
    ) {
      setIsMyProfile(true);
    } else {
      setIsMyProfile(false);
      followCheck()
    }

    let photoName = null;
    if(selectedProfile && selectedProfile[0].profilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedProfile[0].profilePhoto.split("/").pop()}`;
    }
    
    setProfileVals({
      id: selectedProfile &&  selectedProfile[0].id,
      name: selectedProfile && selectedProfile[0].UserName,
      bio: selectedProfile &&  selectedProfile[0].profileBio,
      photo: photoName,
    });

  }, [selectedProfile]);

  async function followCheck() {
  let follows = await checkIfUserFollows(
    profile[0].UserID,
    selectedProfile[0].UserID
  );
  if (follows && follows.length > 0) {
    setIsfFollowing(follows[0].id);
  }
}

const handleFollow = async () => {

  let permissionGiven = await registerForPushNotificationsAsync(activeSession, "yes");
  if (!permissionGiven) {
    return
  }

  if (isFollowing) {
    deleteUserFollow(isFollowing);
  } else {
      let newRecord = await insertUserFollow(
        profile[0].UserID,
        selectedProfile[0].UserID
      );
      setIsfFollowing(newRecord[0].id);    
  }
};

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {

        let fileName = await imageUpload(image)

        if (profileVals.photo !== null || profileVals.photo === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: profileVals.photo.split("/").pop(),
          });
        }

        setProfileVals({
          ...profileVals,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateProfile({
          ...profileVals,
          photo: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };
  
  const onClose = () => {
    setSelectedProfile(null);
    setLevelTwoScreen(false);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    // setChosenModal("DiveSite");
    // setMapHelper(true);
    // setMapConfig(2);
    // setLevelOneScreen(false);
  };

  const openSettingsScreen = () => {
    setLevelTwoScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("SettingsScreen");
    useButtonPressHelper(
      "SettingsScreen",
      activeScreen,
      levelOneScreen,
      setLevelOneScreen
    );
  };
  
  const popoverConent = () => {
    return (
    <>
    <IconWithLabel 
    label="Change Header Image"
    iconName="camera-flip-outline"
    buttonAction={() => handleImageUpload()}
    />
    <IconWithLabel 
    label="Open Settings"
    iconName="settings"
    buttonAction={() => openSettingsScreen()}
    />
    </>
    )
  };

  return (
    <ParallaxDrawer 
      headerImage={profileVals && profileVals.photo ? { uri: profileVals.photo } : noImage} 
      onClose={onClose} 
      onMapFlip={onNavigate}
      popoverConent={isMyProfile && popoverConent}
      isMyShop={isMyProfile}
      >
      <UserProfileScreen onMapFlip={onNavigate} isMyShop={isMyProfile}/>
    </ParallaxDrawer>
  );
}
