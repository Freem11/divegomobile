import React, { useEffect, useRef, useState } from "react";

import noImage from "../../png/NoImage.png";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { useDiveShopNavigation } from "../diveShop/types";
import { getReviewById } from "../../../supabaseCalls/diveSiteReviewCalls/gets";
import getImagePublicUrl from "../../helpers/getImagePublicUrl";
import { IMAGE_SIZE } from "../../../entities/image";

import ReviewScreen from ".";

type ReviewParallaxProps = {
  id: number;
};

export default function ReviewParallax(props: ReviewParallaxProps) {
  const drawerRef = useRef<ParallaxDrawerHandle>(null);
  const diveShopNavigation = useDiveShopNavigation();
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    getReview();
  }, [props.id]);

  const getReview = async () => {
    const reviewInfo = await getReviewById(props.id);
    setSelectedReview(reviewInfo.result);
  };

  const onClose = async () => {
    diveShopNavigation.goBack();
  };

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={getImagePublicUrl(selectedReview?.diveSiteProfilePhoto, IMAGE_SIZE.XL, noImage)}
      onClose={onClose}
    >
      <ReviewScreen selectedReview={selectedReview} />
    </ParallaxDrawer>
  );
}