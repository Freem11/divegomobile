import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Linking } from "react-native";
import {
  grabProfileById,
  updatePushToken,
} from '../../supabaseCalls/accountSupabaseCalls';

export const registerForPushNotificationsAsync = async (activeSession, runAlert) => {

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted" && runAlert == "yes") {
      Alert.alert(
        "Notifications Permission",
        "You previously declined to recieve push notifications" +
          "\n" +
          "\n" +
          "To grant access, and be notifed of this users activities, please visit Scuba SEAsons under your device's settings menu",
        [
          { text: "Go to Settings", onPress: () => Linking.openSettings() },
          { text: "Close", onPress: () => console.log("no tapped") },
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
  console.log("returning true")
  return true
};
