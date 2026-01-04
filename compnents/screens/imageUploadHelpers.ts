import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

import { registerForPhotoLibraryAccessAsync } from "../tutorial/photoLibraryRegistery";
import { uploadphoto } from "../cloudflareBucketCalls/cloudflareAWSCalls";
import { showError } from "../toast";

export const chooseImageHandler = async () => {
  const permissionGiven = await registerForPhotoLibraryAccessAsync("yes");

  if (!permissionGiven) {
    return;
  }

  const chosenImage = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    exif: true,
  });

  try {
    return await chosenImage;
  } catch (e) {
    console.log({ title: "Image Upload", message: e.message });
  }
};

export const multiImageHandler = async () => {
  const permissionGiven = await registerForPhotoLibraryAccessAsync("yes");

  if (!permissionGiven) {
    return;
  }

  const selectedImage = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    aspect: [4, 3],
    quality: 1,
    exif: true,
  });

  try {
    return await selectedImage;
  } catch (e) {
    console.log({ title: "Image Upload", message: e.message });
  }
};

export const imageUploadClean = async (image) => {
  try {
    const uriLink = image.assets[0].uri;
    const extension = uriLink.split(".").pop();
    const fileName = `${Date.now()}.${extension}`;

    const newFileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.copyAsync({
        from: uriLink,
        to: newFileUri,
      });

      await FileSystem.deleteAsync(uriLink);

      console.log(`File successfully moved from ${uriLink} to ${newFileUri}.`);

    } catch (error) {
      console.error("Error moving file with legacy API:", error);
    }

    const fileInfo = await FileSystem.readAsStringAsync(newFileUri, {
      encoding: "base64",
    });

    await uploadphoto(fileInfo, fileName);

    return fileName;

  } catch (error) {
    showError(error.message);
    console.error("Image upload failed:", error);
    return null;
  }
};

export const imageUpload = async (image) => {
  try {
    const uriLink = image.assets[0].uri.uri;
    const extension = uriLink.split(".").pop();
    const fileName = `${Date.now()}.${extension}`;

    const newFileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.copyAsync({
        from: uriLink,
        to: newFileUri,
      });

      await FileSystem.deleteAsync(uriLink);

      console.log(`File successfully moved from ${uriLink} to ${newFileUri}.`);

    } catch (error) {
      console.error("Error moving file with legacy API:", error);
    }

    const fileInfo = await FileSystem.readAsStringAsync(newFileUri, {
      encoding: "base64",
    });

    await uploadphoto(fileInfo, fileName);

    return fileName;

  } catch (error) {
    showError(error.message);
    console.error("Image upload failed:", error);
    return null;
  }
};

export const imageUploadMultiple = async (image, index) => {
  try {
    const uriLink = image.assets[0].uri;
    const extension = uriLink.split(".").pop();
    const fileName = `${Date.now()}-${index}.${extension}`;

    const newFileUri = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.copyAsync({
        from: uriLink,
        to: newFileUri,
      });

      await FileSystem.deleteAsync(uriLink);

      console.log(`File successfully moved from ${uriLink} to ${newFileUri}.`);

    } catch (error) {
      console.error("Error moving file with legacy API:", error);
    }

    const fileInfo = await FileSystem.readAsStringAsync(newFileUri, {
      encoding: "base64",
    });

    await uploadphoto(fileInfo, fileName);

    return fileName;

  } catch (error) {
    showError(error.message);
    console.error("Image upload failed:", error);
    return null;
  }
};

function formatDate(dateTaken) {

  const slicedDate = dateTaken.substring(0, 10);
  const formattedDate1 = slicedDate.replace(":", "-");
  const formattedDate = formattedDate1.replace(":", "-");
  return formattedDate;
}

function createFile(dateTaken, fileSize) {

  const fileName = dateTaken.substring(
    dateTaken.lastIndexOf("/") + 1,
    dateTaken.length
  );

  const fileToUpload = {
    uri: dateTaken,
    name: fileName,
    type: "image/jpg",
    fileSize: fileSize,
  };
  return fileToUpload;
}
export { formatDate, createFile };
