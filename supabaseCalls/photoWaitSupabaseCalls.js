import { supabase } from "../supabase";

export const photoWaits = async () => {
  const { data, error } = await supabase
    .from("photoWait")
    .select();

  if (error) {
    console.log("couldn't do it 30,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const insertPhotoWaits = async (values) => {

  console.log('values', values)
  const { data, error } = await supabase
    .from("photoWait")
    .insert([
      {
        photoFile: values.photoFile,
        label: values.label,
        dateTaken: values.dateTaken,
        latitude: values.latitude,
        longitude: values.longitude,
        UserID: values.UserId,
      },
    ]);

  if (error) {
    console.log("couldn't do it 31,", error);
  }
  return {
    data,
    error,
  };
  // if (data) {
  //   console.log(data);
  // }
};

export const grabPhotoWaitById = async (id) => {
  const { data, error } = await supabase
    .from("photoWait")
    .select()
    .eq("id", id)

  if (error) {
    console.log("couldn't do it 32,", error);
    return [];
  }

  if (data) {
    return data;
  }
};

export const deletePhotoWait = async (id) => {
  const { data, error } = await supabase
    .from("photoWait")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("couldn't do it 33,", error);
    return [];
  }

  // if (data) {
  //   console.log(data);
  // }
};
