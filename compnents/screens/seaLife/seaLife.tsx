import React from "react";

import { cloudflareBucketUrl } from "../../globalVariables";
import SealifePreview from "../../reusables/sealifePreview";
import { SeaLife } from "../../../entities/seaLIfe";
import Label from "../../reusables/label-new";
import GoogleMap from "../../googleMap";
import Histogram from "../bottomDrawer/flatListCombo.tsx/histogram";

import * as S from "./styles";
import { RankingCard } from "./rankingCard";

import { diveSiteStat, userStat } from ".";

type SeaLifeProps = {
  species: string;
  speciesDiveSiteCount: diveSiteStat[];
  speciesUserCount: userStat[];
  seaLifePhotos: any[]
  selectedSeaLife: SeaLife
  onPressDiveSite: (id: number) => void;
  onPressUser: (id: string) => void;
};

export default function SeaLifeScreenView({
  species,
  speciesDiveSiteCount,
  speciesUserCount,
  seaLifePhotos,
  selectedSeaLife,
  onPressDiveSite,
  onPressUser
}: SeaLifeProps) {

  const photos = seaLifePhotos?.map((item) => ({
    ...item,
    photofile: `${cloudflareBucketUrl}${item.photoFile?.split("/").pop()}`
  }));

  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{species}</S.Header>
      </S.InfoContainer>

      <S.Content>{selectedSeaLife?.description}</S.Content>

      <SealifePreview
        speciesCount={null}
        sightingsCount={photos && photos.length}
        diveSitePics={photos}
        onViewMore={null}
        onAddSighting={null}
        selectedProfile={null}
      />

      <S.LabelWrapper>
        <Label label="Oberved Range" />
      </S.LabelWrapper>

      <S.StatRowMajor>
        <S.MiniLabel>Seasonal Trend</S.MiniLabel>
      </S.StatRowMajor>

      <Histogram animal={species} />

      <S.MapContainer
      // pointerEvents="none"
      >
        <GoogleMap species={species} />
      </S.MapContainer>

      <S.LabelWrapper>
        <Label label="Popular Sites" />
      </S.LabelWrapper>

      {speciesDiveSiteCount && speciesDiveSiteCount.map((diveSite) => (
        <RankingCard
          key={diveSite.id}
          item_id={diveSite.id}
          label={diveSite.siteName}
          avatar={diveSite.sitePhoto}
          item_count={diveSite.photo_count}
          onPress={onPressDiveSite}
        />
      ))}

      <S.LabelWrapper>
        <Label label="Top Contributors" />
      </S.LabelWrapper>

      {speciesUserCount && speciesUserCount.map((user) => (
        <RankingCard
          key={user.id}
          item_id={user.id}
          label={user.userName}
          avatar={user.profilePhoto}
          item_count={user.photo_count}
          onPress={onPressUser}
        />
      ))}

    </S.ContentContainer >
  );
}