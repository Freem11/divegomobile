import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Alert, Linking } from "react-native";
import { i18n } from "../../i18n";

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("error", error);
    return;
  }
});

export const registerForForegroundLocationTrackingsAsync = async () => {
  try {
    const forground = await Location.requestForegroundPermissionsAsync();
    return forground.status;
  } catch (e) {
    console.log({ title: "Error76", message: e.message });
  }
};

const requestHighAccuracy = async () => {
  try {
    const accurate = await Location.enableNetworkProviderAsync();
    return accurate.status;
  } catch (e) {
    console.log({ title: "Error87", message: e.message });
  }
};

export const getCurrentCoordinates = async () => {
  const { granted } = await Location.getForegroundPermissionsAsync();

  if (!granted) {
    registerForForegroundLocationTrackingsAsync();
    requestHighAccuracy();
  }
  foregroundSubscription?.remove();

  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      maximumAge: 10000,
    });
    return location;
  } catch (e) {
    Alert.alert(
      i18n.t("OnBoarding.locationAlertTitle"),
      i18n.t("OnBoarding.locationAlertMessage"),
      [
        { text: i18n.t("OnBoarding.goToSettings"), onPress: () => Linking.openSettings() },
        { text: i18n.t("Common.close"), onPress: () => console.log("no tapped") },
      ]
    );
  }
};
