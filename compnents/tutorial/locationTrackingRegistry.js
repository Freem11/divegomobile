import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Alert, Linking } from "react-native";

import { i18n } from "../../i18n";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";

TaskManager.defineTask(LOCATION_TASK_NAME, async({ data, error }) => {
  if (error) {
    console.error("error", error);
    return;
  }
});

export const registerForForegroundLocationTrackingsAsync = async() => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status;
  } catch (e) {
    console.log({ title: "Error76", message: e.message });
    return "undetermined";
  }
};

export const getCurrentCoordinates = async() => {
  const { granted } = await Location.getForegroundPermissionsAsync();

  if (!granted) {
    const status = await registerForForegroundLocationTrackingsAsync();
    if (status !== "granted") return null;
  }

  try {
    const lastKnown = await Location.getLastKnownPositionAsync({
      maxAge: 30000
    });

    if (lastKnown) {
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return lastKnown;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return location;
  } catch (e) {
    showErrorAlert();
  }
};

export const getSurveyGradeCoordinates = async() => {
  const { granted } = await Location.getForegroundPermissionsAsync();
  if (!granted) {
    const status = await registerForForegroundLocationTrackingsAsync();
    if (status !== "granted") return null;
  }

  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch (e) {
    showErrorAlert();
    throw e;
  }
};

export const warmUpLocation = async() => {
  const { granted } = await Location.getForegroundPermissionsAsync();
  if (!granted) return;

  try {
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    console.log("GPS Warmed up");
  } catch (e) {
    console.log("Error warming up users GPS",  e);
  }
};

const showErrorAlert = () => {
  Alert.alert(
    i18n.t("OnBoarding.locationAlertTitle"),
    i18n.t("OnBoarding.locationAlertMessage"),
    [
      { text: i18n.t("OnBoarding.goToSettings"), onPress: () => Linking.openSettings() },
      { text: i18n.t("Common.close") },
    ]
  );
};