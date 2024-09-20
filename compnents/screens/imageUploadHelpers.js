
import * as ImagePicker from "expo-image-picker";
import { registerForPhotoLibraryAccessAsync } from "../tutorial/photoLibraryRegistery";

export const chooseImageHandler = async() => {
let permissionGiven = await registerForPhotoLibraryAccessAsync("yes");

if (!permissionGiven) {
  return
}

let chosenImage = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
