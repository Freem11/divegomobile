import { Review } from "../../entities/diveSiteReview";
import { supabase } from "../../supabase";

export const getReviewById = async (reveiw_id: number) => {

  const { data, error } = await supabase
    .rpc("get_review_by_id", { q_review_id: reveiw_id });

  if (error) {
    console.log("couldn't do it GET_SINGLE_REVIEW,", error);
    return [];
  }

  return {
    data,
    error,
  };
};

export const getReviewsBySiteId = async (divesite_id: number) => {
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

export const getRecentThreeReviewsBySiteId = async (divesite_id: number) => {
  const { data, error } = await supabase.rpc("get_recent_review_data_by_divesite_id", {
    q_divesite_id: divesite_id,
    req_limit: 3,
  });

  if (error) {
    console.log("couldn't do it GET_THREE_REVIEWS_FOR_SITE,", error);
    return [];
  }

  console.log("data", data);
  if (data) {
    return data as Review[];
  }
  return [] as Review[];
};

export const getRecentReviewsByUserId = async ({ userId, limit }: { userId: string, limit: number }) => {
  const { data, error } = await supabase.rpc("get_recent_review_data_by_user_id", {
    q_user_id: userId,
    req_limit: limit,
  });

  if (error) {
    console.log("couldn't do it GET_THREE_REVIEWS_FOR_USER,", error);
    return [];
  }

  if (data) {
    return data as Review[];
  }
  return [] as Review[];
};

export const getReviewPhotosByReviewId = async (reveiw_id: number) => {

  const { data, error } = await supabase.from("diveSiteReviewPhotos")
    .select()
    .eq("review_id", reveiw_id);;

  if (error) {
    console.log("couldn't do it REVIEW_PHOTOS_INSERT,", error);
  }

  return {
    data,
    error,
  };
};