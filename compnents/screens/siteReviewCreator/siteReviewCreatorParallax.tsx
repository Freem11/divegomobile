import React, { useContext } from "react";

import ParallaxDrawer from "../../reusables/parallaxDrawer";
import Center from "../../png/Beach.jpg";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";

import SiteReviewCreatorPage from ".";

export default function ShopListParallax() {
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const onClose = async() => {
    setLevelOneScreen(false);
  };

  return (
    <ParallaxDrawer
      headerImage={Center}
      onClose={onClose}
    >
      <SiteReviewCreatorPage/>

    </ParallaxDrawer>
  );
}
