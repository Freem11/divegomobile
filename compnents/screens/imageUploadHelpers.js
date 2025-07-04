import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { registerForPhotoLibraryAccessAsync } from "../tutorial/photoLibraryRegistery";
import { uploadphoto } from "./../cloudflareBucketCalls/cloudflareAWSCalls";

export const chooseImageHandler = async () => {
  let permissionGiven = await registerForPhotoLibraryAccessAsync("yes");

  if (!permissionGiven) {
    return
  }

  let chosenImage = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'],
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
}


export const imageUpload = async (image) => {
  let stage1 = image.assets[0].uri
  let uriLink = stage1.uri;
  let extension = uriLink.split(".").pop();
  const fileName = `${Date.now()}.${extension}`;

  const newFileUri = FileSystem.documentDirectory + fileName;

  await FileSystem.moveAsync({
    from: uriLink,
    to: newFileUri,
  });

  const fileInfo = await FileSystem.readAsStringAsync(newFileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await uploadphoto(fileInfo, fileName);

  return (fileName);

}


function formatDate(dateTaken) {

  let slicedDate = dateTaken.substring(0, 10);
  let formattedDate1 = slicedDate.replace(":", "-");
  let formattedDate = formattedDate1.replace(":", "-");
  return formattedDate;
}

function createFile(dateTaken, fileSize) {


  let fileName = dateTaken.substring(
    dateTaken.lastIndexOf("/") + 1,
    dateTaken.length
  );

  const fileToUpload = {
    uri: dateTaken,
    name: fileName,
    type: "image/jpg",
    fileSize: fileSize,
  };
  return fileToUpload
}
export { formatDate, createFile };
