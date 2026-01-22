import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Share from "react-native-share";
import { Keyboard, ActivityIndicator, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StackActions } from "@react-navigation/native";

import noImage from "../../png/NoImage.png";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import IconWithLabel from "../../reusables/iconWithLabal";
import { grabProfileById } from "../../../supabaseCalls/accountSupabaseCalls";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";
import { checkIfUserFollows, deleteUserFollow, insertUserFollow } from "../../../supabaseCalls/userFollowSupabaseCalls";
import { registerForPushNotificationsAsync } from "../../tutorial/notificationsRegistery";
import { EditsContext } from "../../contexts/editsContext";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { useAppNavigation } from "../../mapPage/types";
import { EDIT_TYPE } from "../../../entities/editTypes";
import { colors } from "../../styles";

import UserProfileScreen from ".";

type UserProfileProps = {
  profileID: number
};

export default function UserProfileParallax(props: UserProfileProps) {
  const navigation = useAppNavigation();
  const drawerRef = useRef<ParallaxDrawerHandle>(null);

  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );

  const [profileVals, setProfileVals] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsfFollowing] = useState(null);

  const { setEditInfo } = useContext(EditsContext);
  const { userProfile } = useUserProfile();

  useFocusEffect(
    useCallback(() => {
      return () => {
        drawerRef.current?.close(null, false);
      };
    }, [])
  );

  useEffect(() => {
    const loadData = async () => {
      if (!props.profileID) return;
      setLoading(true);
      await getProfileinfo();
      setLoading(false);
    };

    loadData();
  }, [props.profileID]);

  const getProfileinfo = async () => {
    const profileinfo = await grabProfileById(props.profileID);
    const data = Array.isArray(profileinfo) ? profileinfo[0] : profileinfo;
    setSelectedProfile(data);
  };

  useEffect(() => {
    if (selectedProfile && Number(selectedProfile.id) === Number(props.profileID)) {
      if (selectedProfile?.user_id === userProfile?.UserID) {
        setIsMyProfile(true);
      } else {
        setIsMyProfile(false);
        followCheck();
      }

      let photoName = null;
      if (selectedProfile?.profilePhoto) {
        photoName = `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${selectedProfile.profilePhoto.split("/").pop()}`;
      }

      setProfileVals({
        id: selectedProfile?.id,
        name: selectedProfile?.UserName,
        bio: selectedProfile?.profileBio,
        photo: photoName,
      });
    }
  }, [selectedProfile, props.profileID, userProfile?.UserID]);

  async function followCheck() {
    if (!userProfile?.UserID || !selectedProfile?.user_id) return;
    const follows = await checkIfUserFollows(userProfile.UserID, selectedProfile.user_id);
    setIsfFollowing(follows?.[0]?.id || null);
  }

  const addFollow = async () => {
    const permissionGiven = await registerForPushNotificationsAsync(userProfile.UserID, "yes");
    if (!permissionGiven) return;

    const newRecord = await insertUserFollow(userProfile.UserID, selectedProfile.user_id);
    setIsfFollowing(newRecord.id);
  };

  const removeFollow = async () => {
    if (!isFollowing) return;
    await deleteUserFollow(isFollowing);
    setIsfFollowing(null);
  };

  const handleOnClose = () => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.dispatch(StackActions.pop(1));
    }
  };

  const openSettingsScreen = () => navigation.navigate("Settings");

  const openEditsPage = () => {
    navigation.navigate("EditScreen", { id: selectedProfile.id, dataType: EDIT_TYPE.USER_PROFILE });
    setEditInfo("Profile");
  };

  const handleShare = async () => {
    try {
      await Share.open({ title: "Share Profile", url: "https://scubaseasons.com" });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const popoverContent = () => (
    <>
      {isMyProfile && <IconWithLabel label="Update Profile" iconName="camera-flip-outline" buttonAction={openEditsPage} />}
      {isMyProfile && <IconWithLabel label="Settings" iconName="settings" buttonAction={openSettingsScreen} />}
      <IconWithLabel label="Share Profile" iconName="share" buttonAction={handleShare} />
      {!isMyProfile && !isFollowing && (
        <IconWithLabel label={`Follow ${selectedProfile?.UserName || "User"}`} iconName="plus" buttonAction={addFollow} />
      )}
      {!isMyProfile && isFollowing && (
        <IconWithLabel label={`Unfollow ${selectedProfile?.UserName || "User"}`} iconName="minus" buttonAction={removeFollow} />
      )}
    </>
  );

  // Still show the drawer structure so the 'Back' button works during load
  if (loading && !profileVals) {
    return (
      <ParallaxDrawer
        ref={drawerRef}
        headerImage={noImage}
        onClose={!isMyProfile ? handleOnClose : undefined}
      >
        <View style={{ flex: 1, justifyContent: "center", paddingTop: 100 }}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      </ParallaxDrawer>
    );
  }

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={profileVals?.photo ? { uri: profileVals.photo } : noImage}
      onClose={!isMyProfile ? handleOnClose : undefined}
      onMapFlip={() => Keyboard.dismiss()}
      popoverContent={popoverContent}
      isMyShop={isMyProfile}
    >
      <UserProfileScreen key={props.profileID} selectedProfile={selectedProfile} />
    </ParallaxDrawer>
  );
}