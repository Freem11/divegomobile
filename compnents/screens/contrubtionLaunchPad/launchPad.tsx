import React from "react";

import Button from "../../reusables/button";

import * as S from "./styles";

type ContributionLaunchPadViewProps = {
  handleDeviceSyncMove: () => void;
  handleSiteSubmitterMove: () => void;
  handleMapFlip: () => void;
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
        title="Sync your Device"
        onPress={handleDeviceSyncMove}
      />

      <Button
        size="large"
        iconLeft="anchor-plus"
        title="Add a Dive Site"
        onPress={handleSiteSubmitterMove}
      />

      <S.ButtonAndText>
        <Button
          size="large"
          iconLeft="diving-scuba-flag"
          title="Contribute to a Dive Site"
          onPress={handleMapFlip}
        />
        <S.HelpText>
          ( Review a Dive Site or Add a Sea Life Sighting )
        </S.HelpText>
      </S.ButtonAndText>

    </S.ContentContainer>
  );

}