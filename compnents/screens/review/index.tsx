import React from "react";

import { ReviewSingle } from "../../../entities/diveSiteReview";

import ReviewScreenView from "./review";

type ReviewProps = {
  closeParallax?: (mapConfig: number | null) => void;
  restoreParallax?: () => void;
  selectedReview: ReviewSingle;
  bottomHitCount?: number;
  gestureRef?: any;
};

export default function ReviewScreen({
  selectedReview,
  gestureRef,
  ...rest
}: ReviewProps) {
  return (
    <ReviewScreenView
      selectedReview={selectedReview}
      gestureRef={gestureRef}
      {...rest}
    />
  );
}