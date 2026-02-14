import React, { } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import email from "react-native-email";

import {
  signOut,
  userDelete
} from "../../../supabaseCalls/authenticateSupabaseCalls";
import {
  addDeletedAccountInfo,
  deleteProfile
} from "../../../supabaseCalls/accountSupabaseCalls";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { useUserHandler } from "../../../store/user/useUserHandler";
import { useAppNavigation } from "../../mapPage/types";

import SettingsPageView from "./settings";

export default function SettingsPage() {

  const navigation = useAppNavigation();

  const userHandler = useUserHandler();
  const { userProfile } = useUserProfile();

  const { t } = useTranslation();

  let profileType;
  if (userProfile?.partnerAccount) {
    profileType = "Partner Account";
  } else {
    profileType = "Diver Account";
  }

  const openPartnerAccountScreen = () => {
    navigation.navigate("PartnerRequestUpgrade");
  };

  const onClose = () => {
    navigation.goBack();
  };

  const handleLogout = async() => {
    userHandler.userLogout();
  };

  const alertHandler = async() => {
    Alert.alert(
      t("SettingsPage.aboutToDeleteAccountTitle"),
      t("SettingsPage.deleteAccountMessage"),
      [
        {
          text: t("SettingsPage.deleteAccountButton"),
          onPress: handleAccountDelete,
        },
        {
          text: t("SettingsPage.cancelDeleteButton"),
          onPress: () => console.log("no tapped"),
        },
        {
          text: t("SettingsPage.contactSupportButton"),
          onPress: handleEmail,
        },
      ]
    );
  };

  let blurb;
  let first;
  let last;

  if (userProfile) {
    // first = activeSession.user.user_metadata.firstName || "";
    // last = activeSession.user.user_metadata.lastName || "";
    blurb = `:${userProfile.UserID}`;
  }

  const handleEmail = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      subject: `Delete Account Request ${blurb}`,
      body: "Hello I am deleting my Scuba SEAsons account and would also like to also have the following of my submissions removed as well \n \n My Dive Sites (Y/N) \n My Photo Submissions (Y/N) \n \n As removing these submisions would diminish the experience for others divers in the community, would you be willing to negotiate with Scuba SEAsons to allow these to stay in the app? (Y/N)",
      checkCanOpen: false
    }).catch(console.error);
  };

  const handleAccountDelete = async() => {
    if (blurb) {
      await addDeletedAccountInfo({
        firstName: first,
        lastName: last,
        email: userProfile.Email,
        UserID: userProfile.UserID
      });

      await deleteProfile(userProfile.UserID);
      await userDelete(userProfile.UserID);
      await signOut();
    }
  };
  return (
    <SettingsPageView
      profileType={profileType}
      openPartnerAccountScreen={openPartnerAccountScreen}
      onClose={onClose}
      handleLogout={handleLogout}
      alertHandler={alertHandler}
    />
  );

}