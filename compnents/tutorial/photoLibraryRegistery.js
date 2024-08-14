import * as ImagePicker from "expo-image-picker";

export const registerForPhotoLibraryAccessAsync = async () => {

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    console.log("image library permissions denied");
    return;
  }
  
};
