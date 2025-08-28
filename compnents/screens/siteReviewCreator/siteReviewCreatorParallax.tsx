import React, { useContext } from "react";

import ParallaxDrawer from "../../reusables/parallaxDrawer";
import Center from "../../png/Beach.jpg";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";

import SiteReviewCreatorPage from ".";

type SiteReviewerParallaxProps = {
  selectedDiveSite: number
};

export default function SiteReveiwerParallax(props: SiteReviewerParallaxProps) {
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const onClose = async() => {
    setLevelTwoScreen(false);
  };

  return (
    <ParallaxDrawer
      headerImage={Center}
      onClose={onClose}
    >
      <SiteReviewCreatorPage
        selectedDiveSite={props.selectedDiveSite}
      />

    </ParallaxDrawer>
  );
}
