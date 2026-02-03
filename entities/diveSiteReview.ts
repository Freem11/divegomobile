export type Review = {
  review_id: number;
  active: boolean;
  created_at: string;
  created_by: string;
  description: string;
  dive_date: string;
  diveSite_id: number;
  updated_at: string | null;
  updated_by: string | null;
  user_name: string;
  user_id: string;
  conditions: ReviewCondition[]
  photos: ReviewPhotos[]
  profilePhoto: string;
  divesite_id: number;
  divesite_name: string;
  public_domain: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export type ReviewSingle = {
  review_id: number;
  active: boolean;
  created_at: string;
  created_by: string;
  description: string;
  dive_date: string;
  diveSite_id: number;
  divesite_name: string;
  updated_at: string | null;
  updated_by: string | null;
  user_id: string;
  user_name: string;
  conditions: ReviewCondition[]
  photos: any[]
  profilePhoto: string;
  diveSiteProfilePhoto: string;
  reviewer_public_domain: string;
  reviewer_sm: string;
  reviewer_md: string;
  reviewer_lg: string;
  reviewer_xl: string;
};

export type ReviewCondition = {
  condition_entry_id: number;
  condition_type_id?: number
  value: number;
};

export type ReviewPhotos = {
  review_id: number;
  photoPath: string;
};

export type ReviewInsert = {
  created_by: string;
  diveSite_id: number;
  dive_date: string;
  description: string;
};

export type ReviewConditionInsert = {
  review_id: number;
  condition_id: number;
  value: number;
};

export type ReviewPhotoInsert = {
  review_id: number;
  photoPath: string;
};

export type ReviewPhotoEdit = {
  id: number;
  review_id: number;
  photoPath: string;
  decision: string;
};

export type ReviewUpdate = {
  dive_date: string;
  description: string;
};