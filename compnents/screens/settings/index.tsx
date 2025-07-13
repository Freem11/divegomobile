import React, { useContext } from "react";
import SettingsPageView from "./settings";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { SessionContext } from "../../contexts/sessionContext";
import * as SecureStore from "expo-secure-store";
import {
  signOut,
  userDelete
} from "../../../supabaseCalls/authenticateSupabaseCalls";
import {
  addDeletedAccountInfo,
  deleteProfile
} from "../../../supabaseCalls/accountSupabaseCalls";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import email from "react-native-email";

type SettingsPageProps = {};

export default function SettingsPage({}: SettingsPageProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { profile } = useContext(UserProfileContext);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { activeSession, setActiveSession } = useContext(SessionContext);

  const { t } = useTranslation();

  
  let profileType;
  if (profile.partnerAccount) {
    profileType = "Partner Account";
  } else {
    profileType = "Diver Account";
  }

  const openPartnerAccountScreen = () => {
    setLevelTwoScreen(true);
    setLevelOneScreen(false);
    setActiveScreen("PartnerRequestScreen");
  };
  
  const handleLogout = async () => {
    await setActiveSession(null);
    await SecureStore.deleteItemAsync("token");
    await signOut();
  };


  const alertHandler = async () => {
    Alert.alert(
      t('SettingsPage.aboutToDeleteAccountTitle'),
      t('SettingsPage.deleteAccountMessage'),
      [
        {
          text: t('SettingsPage.deleteAccountButton'),
          onPress: handleAccountDelete,
        },
        {
          text: t('SettingsPage.cancelDeleteButton'),
          onPress: () => console.log('no tapped'),
        },
        {
          text: t('SettingsPage.contactSupportButton'),
          onPress: handleEmail,
        },
      ]
    );
  };

  let blurb;
  let first;
  let last;

  if (activeSession) {
    first = activeSession.user.user_metadata.firstName || "";
    last = activeSession.user.user_metadata.lastName || "";
    blurb = `:${activeSession.user.id}` || null;
  }

  const handleEmail = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      subject: `Delete Account Request ${blurb}`,
      body: "Hello I am deleting my Scuba SEAsons account and would also like to also have the following of my submissions removed as well \n \n My Dive Sites (Y/N) \n My Photo Submissions (Y/N) \n \n As removing these submisions would diminish the experience for others divers in the community, would you be willing to negotiate with Scuba SEAsons to allow these to stay in the app? (Y/N)",
      checkCanOpen: false
    }).catch(console.error);
  };

  const handleAccountDelete = async () => {
    if (blurb) {
      await addDeletedAccountInfo({
        firstName: first,
        lastName: last,
        email: activeSession.user.email,
        UserID: activeSession.user.id
      });

      await deleteProfile(activeSession.user.id);
      await userDelete(activeSession.user.id);
      await setActiveSession(null);
      await SecureStore.deleteItemAsync("token");
      await signOut();
    }
  };
  return (
    <SettingsPageView
      profileType={profileType}
      openPartnerAccountScreen={openPartnerAccountScreen}
      setLevelOneScreen={setLevelOneScreen}
      handleLogout={handleLogout}
      alertHandler={alertHandler}
    />
  )

}