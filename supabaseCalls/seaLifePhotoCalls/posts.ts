import { PhotoWaitInsert } from "../../entities/photoWaits";
import { supabase } from "../../supabase";

export const insertPhotoWaits = async (values: PhotoWaitInsert[]) => {
  const { data, error } = await supabase
    .from("photoWait")
    .insert(values)
    .select();

  if (error) {
    console.log("couldn't do it SEALIFE_PHOTOWAIT_INSERTS,", error);

    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
};

