import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { cloudflareBucketUrl } from "../../globalVariables";
import SealifePreview from "../../reusables/sealifePreview";
import { SeaLife } from "../../../entities/seaLIfe";
import Label from "../../reusables/label-new";
import GoogleMap from "../../googleMap";

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

      <S.LabelWrapper>
        <Label label="Oberved Range" />
      </S.LabelWrapper>

      <View
        pointerEvents="none"
        style={{
          width: "100%",
          height: moderateScale(400),
          alignSelf: "center",
          overflow: "hidden",
          borderRadius: moderateScale(10)
        }}
      >
        <GoogleMap species={species} />
      </View>

    </S.ContentContainer >
  );
}