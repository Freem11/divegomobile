import { supabase } from "../supabase";

export const insertPhotoLike = async (userId, photoId) => {

  // console.log("photo waits gets ", values)

  const { data, error } = await supabase
  .from("photoLikes")
  .insert([
    {
      userId: userId,
      photoId: photoId,
    },
  ]);

  if (error) {
    console.log("couldn't do it 40,", error);
  }

  if (data) {
    return (data);
  }
};

export const deletePhotoLike = async (id) => {
  const { data, error } = await supabase
    .from("photoLikes")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("couldn't do it 41,", error);
    return [];
  }

  if (data) {
    console.log(data);
  }
};

export const grabPhotoLikeById = async (userId, picId) => {
  const { data, error } = await supabase
    .from("photoLikes")
    .select()
    .eq("userId", userId)
    .eq("photoId", picId)

  if (error) {
    console.log("couldn't do it 42,", error);
    return [];
  }

  if (data) {
    return data;
  }
};