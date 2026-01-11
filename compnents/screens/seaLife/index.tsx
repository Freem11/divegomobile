import React from "react";

import { ReviewSingle } from "../../../entities/diveSiteReview";

import SeaLifeScreenView from "./seaLife";

type SeaLifeProps = {
  closeParallax?: (mapConfig: number | null) => void;
  restoreParallax?: () => void;
  selectedReview: ReviewSingle;
  bottomHitCount?: number;
  gestureRef?: any;
};

export default function SeaLifeScreen({
  selectedReview,
  gestureRef,
  ...rest
}: SeaLifeProps) {
  return (
    <SeaLifeScreenView
      selectedReview={selectedReview}
      gestureRef={gestureRef}
      {...rest}
    />
  );
}