import React, { useEffect, useRef, useState } from "react";

import noImage from "../../png/NoImage.png";
import ParallaxDrawer, { ParallaxDrawerHandle } from "../../reusables/parallaxDrawer";
import { useDiveShopNavigation } from "../diveShop/types";
import { getReviewById } from "../../../supabaseCalls/diveSiteReviewCalls/gets";
import { cloudflareBucketUrl } from "../../globalVariables";

import SeaLifeScreen from ".";

type SeaLifeParallaxProps = {
  species: string;
};

export default function SeaLifeParallax(props: SeaLifeParallaxProps) {
  const drawerRef = useRef<ParallaxDrawerHandle>(null);
  const diveShopNavigation = useDiveShopNavigation();
  const [selectedSeaLife, setSelectedSeaLife] = useState(null);

  useEffect(() => {
    getSeaLifeInfo();
  }, [props.species]);

  const getSeaLifeInfo = async () => {
    const seaLifeInfo = await getReviewById(props.species);
    setSelectedSeaLife(seaLifeInfo);
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
      <SeaLifeScreen selectedReview={selectedReview?.data} />
    </ParallaxDrawer>
  );
}