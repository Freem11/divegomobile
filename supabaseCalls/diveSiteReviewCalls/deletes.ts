import { supabase } from "../../supabase";

export const deleteReviewConditions = async(review_id: number) => {
  //set to one minute ago
  const minutesAgo = new Date(Date.now() - 60000).toISOString();

  const { data, error } = await supabase
    .from("diveSiteReviewConditions")
    .delete()
    .eq("review_id", review_id)
    .lt("created_at", minutesAgo);

  if (error) {
    console.log("couldn't do it REVIEW_CONDITIONS_DELETE,", error);
  }

  return {
    data,
    error,
  };
};

export const deleteReviewPhotos = async(review_id: number) => {
  //set to one minute ago
  const minutesAgo = new Date(Date.now() - 60000).toISOString();

  const { data, error } = await supabase
    .from("diveSiteReviewPhotos")
    .delete()
    .eq("review_id", review_id)
    .lt("created_at", minutesAgo);

  if (error) {
    console.log("couldn't do it REVIEW_PHOTO_DELETE,", error);
  }

  return {
    data,
    error,
  };
};