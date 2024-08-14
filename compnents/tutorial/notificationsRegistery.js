import { useContext } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { SessionContext } from '../contexts/sessionContext';
import {
  grabProfileById,
  updatePushToken,
} from '../../supabaseCalls/accountSupabaseCalls';

export const registerForPushNotificationsAsync = async (activeSession) => {

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return;
    }

  // let token;
  // try {
  //   token = (
  //     await Notifications.getDevicePushTokenAsync({
  //       projectId: Constants.expoConfig.extra.eas.projectId,
  //     })
  //   ).data;
  // } catch (err) {
  //   console.log("error", err);
  // }

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
    // if (activeToken === null || !activeToken.includes(token)) {
    //   updatePushToken({
    //     token: activeToken ? [...activeToken, token] : [token],
    //     UserID: activeSession.user.id,
    //   });
    // }
    if (activeToken === null || !activeToken.includes(tokenE)) {
      updatePushToken({
        token: activeToken ? [...activeToken, tokenE] : [tokenE],
        UserID: activeSession.user.id,
      });
    }
  }
};
