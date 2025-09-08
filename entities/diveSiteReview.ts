export type Review = {
  id: number;
  active: boolean;
  created_at: string;
  created_by: string;
  description: string;
  dive_date: string;
  diveSite_id: number;
  updated_at: string | null;
  updated_by: string | null;
  user_name: string;
  conditions: ReviewCondition[]
  photos: ReviewPhotos[]
};

export type ReviewCondition = {
  condition_entry_id: number;
  condition_type_id: number
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

export type ReviewPhotosInsert = {
  review_id: number;
  photoPath: string;
};
