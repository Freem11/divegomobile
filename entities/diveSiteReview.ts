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