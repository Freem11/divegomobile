import { ReviewConditionInsert, ReviewInsert, ReviewPhotoInsert } from "../../entities/diveSiteReview";
import { supabase } from "../../supabase";

export const insertReview = async(values: ReviewInsert) => {
  const { data, error } = await supabase
    .from("diveSiteReviews")
    .insert([
      {
        divesite_id: values.diveSite_id,
        dive_date: values.dive_date,
        description: values.description,
        created_by: values.created_by
      },
    ])
    .select();

  if (error) {
    console.log("couldn't do it REVIEW_INSERT,", error);
  }

  return {
    data,
    error,
  };
};

export const insertReviewConditions = async(values: ReviewConditionInsert[]) => {
  const { data, error } = await supabase
    .from("diveSiteReviewConditions")
    .insert(values)
    .select();

  if (error) {
    console.log("couldn't do it REVIEW_CONDITIONS_INSERT,", error);

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

export const insertReviewPhotos = async(values: ReviewPhotoInsert[]) => {

  const { data, error } = await supabase
    .from("diveSiteReviewPhotos")
    .insert(values)
    .select();

  if (error) {
    console.log("couldn't do it REVIEW_PHOTOS_INSERT,", error);
  }

  return {
    data,
    error,
  };
};

