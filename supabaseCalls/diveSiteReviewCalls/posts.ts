import { Review, ReviewConditionInsert, ReviewInsert, ReviewPhotosInsert } from "../../entities/diveSiteReview";
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
  }

  return {
    data,
    error,
  };
};

export const insertReviewPhotos = async(values: ReviewPhotosInsert[]) => {

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

export const getReviewsBySiteId= async(divesite_id: number) => {
  const { data, error } = await supabase.rpc("get_review_data_by_divesite_id", {
    q_divesite_id: divesite_id,
  });

  if (error) {
    console.log("couldn't do it GET_REVIEWS_FOR_SITE,", error);
    return [];
  }

  if (data) {
    return data as Review[];
  }
  return [] as Review[];
};