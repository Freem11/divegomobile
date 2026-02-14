import { supabase } from "../supabase";
import { CommentItem } from "../compnents/screens/comments/photoCommentsParallax";
import { Image } from "../entities/image";

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
  const { data, error } = await supabase.rpc("get_comments_with_user_new", {
    photo_id_param: id
  });

  if (error) {
    console.log("couldn't do it GET_COMMENTS_BY_PHOTO_ID,", error);
    return [];
  }

  const result = [] as CommentItem[];
  if (data) {
    data.forEach((item: any) => {
      const avatar: Image = {
        file_name: item.profilePhoto,
        public_domain: item.public_domain,
        sm: item.sm,
        md: item.md,
        lg: item.lg,
        xl: item.xl,
      };

      const microResult = {
        ...item,
        avatar: avatar,
      };

      result.push(microResult);

    });

  }
  return result;
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