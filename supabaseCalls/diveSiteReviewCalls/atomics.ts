import { supabase } from "../../supabase";
import { ReviewConditionInsert, ReviewPhotosInsert } from "../../entities/diveSiteReview";

export const replaceReviewConditionsAtomic = async(
  review_id: number,
  newConditions: ReviewConditionInsert[]
) => {
  const conditionsToInsert = newConditions.map(({ review_id: _, ...rest }) => rest);

  const conditionsJson = JSON.stringify(conditionsToInsert);

  const { data, error } = await supabase
    .rpc("replace_review_conditions_atomic", {
      p_review_id: review_id,
      p_conditions: conditionsJson,
    });

  if (error) {
    console.error("Atomic condition replacement failed (Rolled Back):", error);
    return { data: null, error };
  }

  return {
    data: data,
    error: null,
  };
};

export const replaceReviewPhotosAtomic = async(
  review_id: number,
  newPhotos: ReviewPhotosInsert[]
) => {
  const photosToInsert = newPhotos.map(({ review_id: _, ...rest }) => rest);

  const photosJson = JSON.stringify(photosToInsert);

  const { data, error } = await supabase
    .rpc("replace_review_photos_atomic", {
      p_review_id: review_id,
      p_photos: photosJson,
    });

  if (error) {
    console.error("Atomic photo replacement failed (Rolled Back):", error);
    return { data: null, error };
  }

  return {
    data: data,
    error: null,
  };
};