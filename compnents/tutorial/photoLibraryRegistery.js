import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export const registerForPhotoLibraryAccessAsync = async (runAlert) => {

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted" && runAlert === "yes") {
    Alert.alert(
      "Photo Library Permission",
      "You previously declined to grant access to your device's photo library"+
        "\n" +
        "\n" +
        "To grant access, please visit Scuba SEAsons under your device's settings menu",
      [
        { text: "Go to Settings", onPress: () => Linking.openSettings() },
        { text: "Close", onPress: () => console.log("no tapped") },
      ]
    );
    return false;
  } else {
    return true;
  }
  
};
