import React, { useContext, useEffect, useState } from "react";
import Share from "react-native-share";
import { Keyboard } from "react-native";

import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import noImage from "../../png/NoImage.png";
import ParallaxDrawer from "../../reusables/parallaxDrawer";
import { UserProfileContext } from "../../contexts/userProfileContext";
import IconWithLabel from "../../reusables/iconWithLabal";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { grabProfileById} from "../../../supabaseCalls/accountSupabaseCalls";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { checkIfUserFollows, deleteUserFollow, insertUserFollow } from "../../../supabaseCalls/userFollowSupabaseCalls";
import { registerForPushNotificationsAsync } from "../../tutorial/notificationsRegistery";
import { SessionContext } from "../../contexts/sessionContext";
import { EditsContext } from "../../contexts/editsContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";

import UserProfileScreen from ".";

type UserProfileProps = {
  profileID: number
};

export default function UserProfileParallax(props: UserProfileProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );

  const [profileVals, setProfileVals] = useState(null);
  const { profile } = useContext(UserProfileContext);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const { activeSession } = useContext(SessionContext);
  
  const [isFollowing, setIsfFollowing] = useState<string | null>(null);

  const { setEditInfo } = useContext(EditsContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  useEffect(() => {
    getProfileinfo()
  }, [props.profileID]);

  const getProfileinfo = async() => {
    const profileinfo = await grabProfileById(props.profileID)
    setSelectedProfile(profileinfo)
  }

  useEffect(() => {
    if (
      (selectedProfile?.user_id === profile?.user_id)
    ) {
      setIsMyProfile(true);
    } else {
      setIsMyProfile(false);
      followCheck()
    }

    let photoName = null;
    if(selectedProfile?.profilePhoto) {
      photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedProfile.profilePhoto.split("/").pop()}`;
    }
    
    setProfileVals({
      id: selectedProfile?.id,
      name: selectedProfile?.UserName,
      bio: selectedProfile?.profileBio,
      photo: photoName,
    });

  }, [selectedProfile]);

  async function followCheck() {
    const follows = await checkIfUserFollows(
      profile.user_id,
      selectedProfile.user_id
    );
    if (follows && follows.length > 0) {
      setIsfFollowing(follows[0].id);
    }
  }

  const addFollow = async() => {
    const permissionGiven = await registerForPushNotificationsAsync(activeSession, "yes");
    if (!permissionGiven) {
      return
    }
    const newRecord = await insertUserFollow(
      profile.UserID,
      selectedProfile.user_id
    );
    setIsfFollowing(newRecord.id);    
  }

  const removeFollow = async() => {
    const permissionGiven = await registerForPushNotificationsAsync(activeSession, "yes");
    if (!permissionGiven) {
      return
    }
    deleteUserFollow(isFollowing);
  }
  
  const onClose = () => {
    setSelectedProfile(null);
    setLevelTwoScreen(false);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
  };

  const openSettingsScreen = () => {
    setLevelTwoScreen(false);
    setLevelOneScreen(true);
    setActiveScreen("SettingsScreen");
  };
  
  const openEditsPage = () => {
    setFullScreenModal(true)
    setEditInfo("Profile")
    setActiveTutorialID("EditsScreen")
  };

  const handleShare = async() => {
    try {
      await Share.open({
        title: "Share Scuba SEAsons Profile",
        url: "https://scuba-seasons.web.app",
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const popoverContent = () => {
    return (
      <>
        {isMyProfile && (
          <IconWithLabel 
            label="Update My Profile"
            iconName="camera-flip-outline"
            buttonAction={() => openEditsPage()}
          />
        )}
        {isMyProfile && (
          <IconWithLabel 
            label="Open Settings"
            iconName="settings"
            buttonAction={() => openSettingsScreen()}
          />
        )}
        <IconWithLabel 
          label="Share Profile"
          iconName="share"
          buttonAction={() => handleShare()}
        />
        {!isMyProfile && !isFollowing && (
          <IconWithLabel 
            label={`Follow ${selectedProfile?.UserName}`}
            iconName="plus"
            buttonAction={() => addFollow()}
          />
        )}
        {!isMyProfile && isFollowing && (
          <IconWithLabel 
            label={`UnFollow ${selectedProfile?.UserName}`}
            iconName="minus"
            buttonAction={() => removeFollow()}
          />
        )}
      </>
    )
  };

  return (
    <ParallaxDrawer 
      headerImage={profileVals && profileVals.photo ? { uri: profileVals.photo } : noImage} 
      onClose={onClose} 
      onMapFlip={onNavigate}
      popoverContent={popoverContent}
      isMyShop={isMyProfile}
    >
      <UserProfileScreen/>
    </ParallaxDrawer>
  );
}
