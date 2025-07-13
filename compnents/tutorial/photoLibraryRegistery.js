import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
import { i18n } from "../../i18n";

export const registerForPhotoLibraryAccessAsync = async (runAlert) => {

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted" && runAlert === "yes") {
    Alert.alert(
      i18n.t("OnBoarding.galleryAlertTitle"),
      i18n.t("OnBoarding.galleryAlertMessage"),
      [
        { text: i18n.t("OnBoarding.goToSettings"), onPress: () => Linking.openSettings() },
        { text: i18n.t("Common.close"), onPress: () => console.log("no tapped") },
      ]
    );
    return false;
  } else {
    return true;
  }

};
