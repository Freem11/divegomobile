import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import email from "react-native-email";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import {
  activeFonts,
  colors,
  fontSizes,
  buttonText,
  authenicationButton
} from "../styles";
import {
  signOut,
  userDelete
} from "../../supabaseCalls/authenticateSupabaseCalls";
import {
  addDeletedAccountInfo,
  deleteProfile
} from "../../supabaseCalls/accountSupabaseCalls";
import { SessionContext } from "../contexts/sessionContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { useActiveScreenStore } from "../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";


const windowHeight = Dimensions.get("window").height;

export default function SettingsPage(props) {
  const { } = props;
  const { t } = useTranslation();
  const { profile } = useContext(UserProfileContext);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { activeSession, setActiveSession } = useContext(SessionContext);

  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

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

  const handleLogout = async() => {
    await setActiveSession(null);
    await SecureStore.deleteItemAsync("token");
    await signOut();
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

  const handleAccountDelete = async() => {
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
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={"darkgrey"}
        onPress={() => setLevelOneScreen(false)}
        style={{ marginTop: "15%", alignSelf: "flex-start", marginLeft: "2%" }}
      />
      <View style={styles.content}>
        <Text style={styles.header}>{t("SettingsPage.header")}</Text>

        <Text style={styles.subHeaders}>
          {t("SettingsPage.subHeading")}
        </Text>

        <View style={styles.dataHousing}>
          <Text style={styles.dataLabels}>{profileType}</Text>
          {profileType === "Diver Account" ? (
            <TouchableWithoutFeedback
              onPress={() => openPartnerAccountScreen()}
            >
              <Text style={styles.promptLinkText}>
                {t("SettingsPage.notPartnerAccount")}
              </Text>
            </TouchableWithoutFeedback>
          ) : null}
        </View>

        <View style={styles.buttonBox}>
          <TouchableWithoutFeedback onPress={() => handleLogout()}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>
                {t("SettingsPage.logout")}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={30}
                color={colors.themeWhite}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <Text style={styles.subHeadersDanger}>
        {t("SettingsPage.dangerZoneBar")}
      </Text>
      <TouchableWithoutFeedback onPress={alertHandler}>
        <View style={styles.dataHousingDanger}>
          <Text style={styles.dataLabelsDanger}>
            {t("SettingsPage.delAccount")}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    // justifyContent: "center",
    height: windowHeight
  },
  content: {
    width: "90%"
  },
  header: {
    zIndex: 10,
    marginTop: "10%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Bold,
    color: "darkgrey"
  },
  subHeaders: {
    zIndex: 10,
    marginTop: "10%",
    fontSize: moderateScale(fontSizes.SubHeading),
    fontFamily: activeFonts.Medium,
    color: "darkgrey",
    marginLeft: "5%"
  },
  subHeadersDanger: {
    zIndex: 10,
    position: "absolute",
    bottom: moderateScale(120),
    marginTop: windowHeight / 6,
    fontSize: moderateScale(fontSizes.SubHeading),
    fontFamily: activeFonts.Medium,
    color: "maroon",
    marginLeft: "5%"
  },
  dataHousing: {
    marginTop: "2%",
    borderTopWidth: moderateScale(1),
    borderTopColor: "darkgrey",
    paddingBottom: "2%",
    borderBottomWidth: moderateScale(1),
    borderBottomColor: "darkgrey"
  },
  dataHousingDanger: {
    position: "absolute",
    bottom: moderateScale(40),
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    borderTopWidth: moderateScale(1),
    borderTopColor: "maroon",
    paddingBottom: "4%",
    borderBottomWidth: moderateScale(1),
    borderBottomColor: "maroon",
    width: "90%"
  },
  dataLabels: {
    zIndex: 10,
    marginTop: "2%",
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Bold,
    color: colors.themeBlack,
    marginLeft: "10%"
  },
  dataLabelsDanger: {
    zIndex: 10,
    marginTop: "4%",
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Bold,
    color: "maroon"
  },
  promptLinkText: {
    marginLeft: "15%",
    marginTop: moderateScale(2),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.thin,
    color: colors.primaryBlue
  },
  buttonBox: {
    zIndex: -1,
    width: "100%",
    alignItems: "flex-end",
    marginTop: moderateScale(-50)
  },
  loginButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 10 }
  ],
  loginText: [buttonText, { marginHorizontal: moderateScale(5) }]
});
