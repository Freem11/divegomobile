import { supabase } from "../../supabase";
import { ReviewUpdate, Review } from "../../entities/diveSiteReview";

interface ReviewUpdateResponse {
  data: Review | null;
  error: Error | null;
}

export const updateDiveSiteReview = async(values: ReviewUpdate, review_id: number): Promise<ReviewUpdateResponse> => {
  try {
    const { data, error } = await supabase
      .from("diveSiteReviews")
      .update(values)
      .eq("id", review_id)
      .select()
      .single();

    if (error) {
      console.log("couldn't do it REVIEW_UPDATE,", error);

      return {
        error: error,
        data: null
      };
    }

    return {
      data: data as Review,
      error: null
    };
  } catch (error) {
    console.log("couldn't do it REVIEW_UPDATE,", error);
    return {
      error: error,
      data: null
    };
  }
};
