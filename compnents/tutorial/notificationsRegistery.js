import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Linking } from "react-native";

import {
  grabProfileById,
  updatePushToken,
} from "../../supabaseCalls/accountSupabaseCalls";
import { i18n } from "../../i18n";

export const registerForPushNotificationsAsync = async(activeSession, runAlert) => {

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted" && runAlert == "yes") {
    Alert.alert(
      i18n.t("OnBoarding.notificationsAlertTitle"),
      i18n.t("OnBoarding.notificationsAlertMessage"),
      [
        { text: i18n.t("OnBoarding.goToSettings"), onPress: () => Linking.openSettings() },
        { text: i18n.t("Common.close"), onPress: () => console.log("no tapped") },
      ]
    );
    return false;
  }

  let tokenE;
  try {
    tokenE = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
  } catch (err) {
    console.log("error", err);
  }

  if (activeSession && activeSession.user) {
    const user = await grabProfileById(activeSession.user.id);
    const activeToken = user[0].expo_push_token;

    if (activeToken === null || !activeToken.includes(tokenE)) {
      updatePushToken({
        token: activeToken ? [...activeToken, tokenE] : [tokenE],
        UserID: activeSession.user.id,
      });

    }
  }
  return true
};
