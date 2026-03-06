import React from "react";

import Button from "../../reusables/button";

import * as S from "./styles";

type ContributionLaunchPadViewProps = {
  handleDeviceSyncMove: () => void;
  handleSiteSubmitterMove: () => void;
};

export default function ContributionLaunchPadView({
  handleDeviceSyncMove,
  handleSiteSubmitterMove
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

    </S.ContentContainer>
  );

}