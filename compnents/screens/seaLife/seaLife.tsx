import React from "react";

import { cloudflareBucketUrl } from "../../globalVariables";
import SealifePreview from "../../reusables/sealifePreview";

import * as S from "./styles";

import { diveSiteStat, userStat } from ".";

type SeaLifeProps = {
  species: string;
  speciesDiveSiteCount: diveSiteStat[];
  speciesUserCount: userStat[];
  selectedSeaLife: any[]
};

export default function SeaLifeScreenView({
  species,
  speciesDiveSiteCount,
  speciesUserCount,
  selectedSeaLife
}: SeaLifeProps) {

  const photos = selectedSeaLife?.map((item) => ({
    ...item,
    photofile: `${cloudflareBucketUrl}${item.photoFile?.split("/").pop()}`
  }));

  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{species}</S.Header>
      </S.InfoContainer>

      <SealifePreview
        speciesCount={null}
        sightingsCount={photos && photos.length}
        diveSitePics={photos}
        onViewMore={null}
        onAddSighting={null}
        selectedProfile={null}
      />

    </S.ContentContainer>
  );
}