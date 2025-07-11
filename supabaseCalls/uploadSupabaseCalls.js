import { supabase } from "../supabase";

export const uploadphoto = async(file, fileName) => {

  // let extension =  oldFileName.split('.').pop();
  // const fileName = Date.now() + "." + extension

  const { data, error } = await supabase.storage
    .from("animalphotos")
    .upload(`public/${fileName}`, file)

  if (error) {
    console.log("couldn't upload photo,", error);
  }
  
  if (data) {
    console.log(`Upload of photo: ${fileName} was sucessful`)
  }
};

export const removePhoto = async(values) => {

  const shortPath =  values.fileName.split("/").pop();

  const { data, error } = await supabase.storage
    .from("animalphotos")
    .remove(`public/${shortPath}`)

  if (error) {
    console.log("couldn't delete photo,", error);
  }
  
  if (data) {
    console.log(`Deletion of photo: ${shortPath} was sucessful`)
  }

};

