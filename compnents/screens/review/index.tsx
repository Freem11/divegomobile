import React from "react";
import { useTranslation } from "react-i18next";

import { ReviewSingle } from "../../../entities/diveSiteReview";

import ReviewScreenView from "./review";

type ReviewProps = {
  closeParallax?: (mapConfig: number) => void;
  restoreParallax?: () => void;
  selectedReview: ReviewSingle;
  bottomHitCount?: number;
};

export default function ReviewScreen({
  selectedReview
}: ReviewProps) {

  return (
    <ReviewScreenView selectedReview={selectedReview} />
  );

}