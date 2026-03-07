import React from "react";

import Button from "../../reusables/button";
import { ScreenReturn } from "../../googleMap/types";

import * as S from "./styles";

type ContributionLaunchPadViewProps = {
  handleDeviceSyncMove: () => void;
  handleSiteSubmitterMove: () => void;
  handleMapFlip: (screenForward: number) => void;
};

export default function ContributionLaunchPadView({
  handleDeviceSyncMove,
  handleSiteSubmitterMove,
  handleMapFlip
}: ContributionLaunchPadViewProps) {

  return (
    <S.ContentContainer>

      <Button
        size="large"
        iconLeft="sync"
        title="Device Sync"
        onPress={handleDeviceSyncMove}
      />

      <Button
        size="large"
        iconLeft="anchor-plus"
        title="Add Dive Site"
        onPress={handleSiteSubmitterMove}
      />

      <Button
        size="large"
        iconLeft="Fish"
        title="Add Sea Life Sightings"
        onPress={() => handleMapFlip(ScreenReturn.SeaLifeSightings)}
      />

      <Button
        size="large"
        iconLeft="diving-snorkel"
        title="Add Dive Site Review"
        onPress={() => handleMapFlip(ScreenReturn.DiveSiteReview)}
      />

    </S.ContentContainer>
  );

}