import { supabase } from "../supabase";

export const insertPhotoComment = async (userId, photoId, comment, userID) => {
  const { data, error } = await supabase
    .from("photoComments")
    .insert([
      {
        userId: userId,
        photoId: photoId,
        content: comment,
        replied_to: userID
      },
    ]);

  if (error) {
    console.log("couldn't do it 50,", error);
  }

  if (data) {
    return (data);
  }
};

export const deletePhotoComment = async (id) => {
  const { data, error } = await supabase
    .from("photoComments")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("couldn't do it 51,", error);
    return [];
  }

  // if (data) {
  //   console.log(data);
  // }
};

export const grabPhotoCommentsByPicId = async (id: number) => {
  const { data, error } = await supabase.rpc("get_comments_with_user", {
    photo_id_param: id
  });

  if (error) {
    console.log("couldn't do it GET_COMMENTS_BY_PHOTO_ID,", error);
    return [];
  }

  return data || [];
};

export const countPhotoCommentById = async (picId) => {
  const { error, count } = await supabase
    .from("photoComments")
    .select("*", { count: "exact" })
    .eq("photoId", picId);

  if (error) {
    console.log("couldn't do it 53,", error);
    return [];
  }

  if (count) {
    return count;
  }
};