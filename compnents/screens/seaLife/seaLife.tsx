import React from "react";
import { Pressable } from "react-native-gesture-handler";

import SealifePreview from "../../reusables/sealifePreview";
import { SeaLife } from "../../../entities/seaLIfe";
import Label from "../../reusables/label-new";
import GoogleMap from "../../googleMap";
import Histogram from "../bottomDrawer/flatListCombo.tsx/histogram";

import * as S from "./styles";
import { RankingCard } from "./rankingCard";

import { diveSiteStat, userStat } from ".";
import { Animal } from "../../../entities/photos";

type SeaLifeProps = {
  species: string;
  speciesDiveSiteCount: diveSiteStat[];
  speciesUserCount: userStat[];
  seaLifePhotos: Animal[]
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

  const [mapActive, setMapActive] = React.useState(false);
  const toggleMap = () => setMapActive(!mapActive);


  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{species}</S.Header>
      </S.InfoContainer>

      <S.Content>{selectedSeaLife?.description}</S.Content>

      <SealifePreview
        speciesCount={null}
        sightingsCount={seaLifePhotos?.length}
        diveSitePics={seaLifePhotos.map((item) => item.image)}
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

      <S.MapContainer>
        <S.MapWrapper pointerEvents={mapActive ? "auto" : "none"}>
          <GoogleMap species={species} />
        </S.MapWrapper>

        {/* This is now a Pressable styled component */}
        {!mapActive && (
          <S.MapOverlay onPress={() => setMapActive(true)}>
            <S.OverlayText>Tap to explore map</S.OverlayText>
          </S.MapOverlay>
        )}

        {/* This is also a Pressable styled component */}
        {mapActive && (
          <S.MapLockOverlay onPress={() => setMapActive(false)}>
            <S.LockText>Done</S.LockText>
          </S.MapLockOverlay>
        )}
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