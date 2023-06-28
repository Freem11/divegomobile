import { supabase } from "../supabase";

  export const uploadphoto = async (file, oldFileName) => {

    let extension =  oldFileName.split('.').pop();
    const fileName = Date.now() + "." + extension

    const { data, error } = await supabase.storage
    .from("animalphotos")
    .upload(`public/${fileName}`, file)

    if (error) {
      console.log("couldn't upload,", error);
    }
  
    if (data) {
      console.log(data)
      return data.Key
    }
  };

  export const removePhoto = async (values) => {

    let shortPath =  values.fileName.split('/').pop();

    const { data, error } = await supabase.storage
    .from("animalphotos")
    .remove(`public/${shortPath}`)

    if (error) {
      console.log("couldn't delete,", error);
    }
  
    if (data) {
      console.log(data)
    }

    };

