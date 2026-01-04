import React, { useEffect, useRef, useState } from "react";

import noImage from "../../png/NoImage.png";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { useDiveShopNavigation } from "../diveShop/types";
import { getReviewById } from "../../../supabaseCalls/diveSiteReviewCalls/gets";
import { cloudflareBucketUrl } from "../../globalVariables";

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
    setSelectedReview(reviewInfo);
  };

  const diveSitePhoto = selectedReview?.data.diveSiteProfilePhoto;
  const fileName = diveSitePhoto ? diveSitePhoto.split("/").pop() : null;
  const remoteUri = `${cloudflareBucketUrl}${fileName}`;

  const onClose = async () => {
    diveShopNavigation.goBack();
  };

  return (
    <ParallaxDrawer
      ref={drawerRef}
      headerImage={diveSitePhoto ? { uri: remoteUri } : noImage}
      onClose={onClose}
    >
      <ReviewScreen selectedReview={selectedReview?.data} />
    </ParallaxDrawer>
  );
}