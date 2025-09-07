import React from "react";

import { ReviewConditionInsert } from "../../../entities/diveSiteReview";

import ReviewCardView from "./view";

type ReviewCardProps = {
  date: string;
  description: string;
  conditions: ReviewConditionInsert[]
  userName: string;

};

export default function ReviewCard({ userName, date, description, conditions }: ReviewCardProps) {

  return (
    <ReviewCardView
      userName={userName}
      date={date}
      description={description}
      conditions={conditions}
    />
  );
}