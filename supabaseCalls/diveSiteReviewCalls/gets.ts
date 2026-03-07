import { Review } from "../../entities/diveSiteReview";
import { Image } from "../../entities/image";
import { supabase } from "../../supabase";

export const getReviewById = async (reveiw_id: number) => {

  const { data, error } = await supabase
    .rpc("get_review_by_id", { q_review_id: reveiw_id });

  if (error) {
    console.log("couldn't do it GET_SINGLE_REVIEW,", error);
    return [];
  }

  const sitePhoto: Image = {
    file_name: data.diveSiteProfilePhoto,
    public_domain: data.ds_public_domain,
    sm: data.ds_sm,
    md: data.ds_md,
    lg: data.ds_lg,
    xl: data.ds_xl,
  };

  const reviewerPhoto: Image = {
    file_name: data.profilePhoto,
    public_domain: data.reviewer_public_domain,
    sm: data.reviewer_sm,
    md: data.reviewer_md,
    lg: data.reviewer_lg,
    xl: data.reviewer_xl,
  };

  const result = {
    ...data,
    profilePhoto: reviewerPhoto,
    diveSiteProfilePhoto: sitePhoto,
  };

  return { result, error };

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

  const result = [] as Review[];
  data.forEach((item: any) => {
    const profilePhoto: Image = {
      file_name: item.profilePhoto,
      public_domain: item.public_domain,
      sm: item.sm,
      md: item.md,
      lg: item.lg,
      xl: item.xl,
    };
    const newReview = {
      ...item,
      profilePhoto: profilePhoto,
    };

    result.push(newReview);
  });
  return result;
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

  const result = [] as Review[];
  data.forEach((item: any) => {
    const profilePhoto: Image = {
      file_name: item.profilePhoto,
      public_domain: item.public_domain,
      sm: item.sm,
      md: item.md,
      lg: item.lg,
      xl: item.xl,
    };
    const newReview = {
      ...item,
      profilePhoto: profilePhoto,
    };

    result.push(newReview);
  });
  return result;
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