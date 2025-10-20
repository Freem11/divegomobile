import { supabase } from "../../supabase";
import { ReviewUpdate, Review } from "../../entities/diveSiteReview";

export const updateDiveSiteReview = async(values: ReviewUpdate, review_id: number) => {

  const { data, error } = await supabase
    .from("diveSiteReviews")
    .update(values)
    .eq("id", review_id)
    .select()
    .single();

  if (error) {
    console.log("couldn't do it REVIEW_UPDATE,", error);
    return [];
  }

  if (data) {
    return data as Review;
  }
};