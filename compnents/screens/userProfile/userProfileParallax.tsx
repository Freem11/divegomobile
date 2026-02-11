import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Share from "react-native-share";
import { Keyboard, ActivityIndicator, View } from "react-native";
import { useFocusEffect, useRoute, StackActions } from "@react-navigation/native";
import { preProcessFile } from "typescript";

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
import getImagePublicUrl from "../../helpers/getImagePublicUrl";
import { IMAGE_SIZE } from "../../../entities/image";

import UserProfileScreen from ".";

type UserProfileProps = {
  profileID?: number
};

export default function UserProfileParallax(props: UserProfileProps) {
  const navigation = useAppNavigation();
  const route = useRoute<any>();
  const drawerRef = useRef<ParallaxDrawerHandle>(null);

  const effectiveID = route.params?.id || props.profileID;

  const { setSelectedProfile } = useContext(SelectedProfileContext);

  const [localProfile, setLocalProfile] = useState<any>(null);
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
      if (!effectiveID) return;
      setLoading(true);

      const profileinfo = await grabProfileById(effectiveID);

      setLocalProfile(profileinfo);

      setSelectedProfile(profileinfo);

      setLoading(false);
    };

    loadData();
  }, [effectiveID]);

  useEffect(() => {
    if (localProfile && Number(localProfile.id) === Number(effectiveID)) {
      if (localProfile?.user_id === userProfile?.UserID) {
        setIsMyProfile(true);
      } else {
        setIsMyProfile(false);
        followCheck();
      }

      setProfileVals({
        id: localProfile?.id,
        name: localProfile?.UserName,
        bio: localProfile?.profileBio,
        photo: getImagePublicUrl(localProfile?.profilePhoto, IMAGE_SIZE.XL),
      });
    }
  }, [localProfile, effectiveID, userProfile?.UserID]);

  async function followCheck() {
    if (!userProfile?.UserID || !localProfile?.user_id) return;
    const follows = await checkIfUserFollows(userProfile.UserID, localProfile.user_id);
    setIsfFollowing(follows?.[0]?.id || null);
  }

  const addFollow = async () => {
    const permissionGiven = await registerForPushNotificationsAsync(userProfile.UserID, "yes");
    if (!permissionGiven) return;
    const newRecord = await insertUserFollow(userProfile.UserID, localProfile.user_id);
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
    navigation.navigate("EditScreen", { id: localProfile.id, dataType: EDIT_TYPE.USER_PROFILE });
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
        <IconWithLabel label={`Follow ${localProfile?.UserName || "User"}`} iconName="plus" buttonAction={addFollow} />
      )}
      {!isMyProfile && isFollowing && (
        <IconWithLabel label={`Unfollow ${localProfile?.UserName || "User"}`} iconName="minus" buttonAction={removeFollow} />
      )}
    </>
  );

  if (loading || !localProfile || Number(localProfile.id) !== Number(effectiveID)) {
    return (
      <ParallaxDrawer ref={drawerRef} headerImage={noImage} onClose={!isMyProfile ? handleOnClose : undefined}>
        <View style={{ flex: 1, backgroundColor: colors.primaryBlue, justifyContent: "center", paddingTop: 100 }}>
          <ActivityIndicator size="large" color="white" />
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
      <UserProfileScreen key={`profile-${effectiveID}`} selectedProfile={localProfile} />
    </ParallaxDrawer>
  );
}