import React from "react";

import { ReviewCondition } from "../../../entities/diveSiteReview";

import ReviewCardView from "./view";

type ReviewCardProps = {
  date: string;
  description: string;
  conditions: ReviewCondition[]
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