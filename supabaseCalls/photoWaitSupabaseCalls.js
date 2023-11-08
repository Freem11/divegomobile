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

  // console.log("photo waits gets ", values)

  const { data, error } = await supabase
  .from("photoWait")
  .insert([
    {
      photoFile: values.PicFile,
      label: values.Animal,
      dateTaken: values.PicDate,
      latitude: values.Latitude,
      longitude: values.Longitude,
      UserID: values.UserId,
      userName: values.UserName
    },
  ]);

  if (error) {
    console.log("couldn't do it 31,", error);
  }

  if (data) {
    console.log(data);
  }
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

  if (data) {
    console.log(data);
  }
};
