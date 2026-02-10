import React, { useState, useCallback } from "react";

import SealifePreview from "../../reusables/sealifePreview";
import { SeaLife } from "../../../entities/seaLIfe";
import Label from "../../reusables/label-new";
import GoogleMap from "../../googleMap";
import Histogram from "../bottomDrawer/flatListCombo.tsx/histogram";
import { Animal } from "../../../entities/photos";
import { GPSBubble } from "../../../entities/GPSBubble";

import * as S from "./styles";
import { RankingCard } from "./rankingCard";

import { diveSiteStat, userStat } from ".";

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
  const [mapActive, setMapActive] = useState(false);
  const [localBoundaries, setLocalBoundaries] = useState<GPSBubble | null>(null);

  // Use callback to ensure the reference is stable but functional
  const handleMapMove = useCallback((bounds: GPSBubble) => {
    setLocalBoundaries(bounds);
  }, []);

  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{species}</S.Header>
      </S.InfoContainer>

      <S.Content>{selectedSeaLife?.description}</S.Content>

      <SealifePreview
        speciesCount={null}
        sightingsCount={seaLifePhotos?.length}
        diveSitePics={seaLifePhotos?.map((item) => item.image)}
        onViewMore={null}
        onAddSighting={null}
        selectedProfile={null}
      />

      <S.LabelWrapper>
        <Label label="Observed Range" />
      </S.LabelWrapper>

      <S.StatRowMajor>
        <S.MiniLabel>Seasonal Trend</S.MiniLabel>
      </S.StatRowMajor>

      {/* CRITICAL: The Histogram must receive the localBoundaries.
          If this prop doesn't change, the Histogram won't re-fetch.
      */}
      <Histogram animal={species} boundaries={localBoundaries} />

      <S.MapContainer>
        <S.MapWrapper pointerEvents={mapActive ? "auto" : "none"}>
          <GoogleMap
            species={species}
            onBoundsChangeLocal={handleMapMove}
          />
        </S.MapWrapper>

        {!mapActive && (
          <S.MapOverlay onPress={() => setMapActive(true)}>
            <S.OverlayText>Tap to explore map</S.OverlayText>
          </S.MapOverlay>
        )}

        {mapActive && (
          <S.MapLockOverlay onPress={() => setMapActive(false)}>
            <S.LockText>Done</S.LockText>
          </S.MapLockOverlay>
        )}
      </S.MapContainer>

      <S.LabelWrapper>
        <Label label="Popular Sites" />
      </S.LabelWrapper>

      {speciesDiveSiteCount?.map((diveSite) => (
        <RankingCard
          key={diveSite.id}
          item_id={diveSite.id}
          label={diveSite.siteName}
          avatar={diveSite.imageVariants}
          item_count={diveSite.photo_count}
          onPress={onPressDiveSite}
        />
      ))}

      <S.LabelWrapper>
        <Label label="Top Contributors" />
      </S.LabelWrapper>

      {speciesUserCount?.map((user) => (
        <RankingCard
          key={user.id}
          item_id={user.id}
          label={user.userName}
          avatar={user.imageVariants}
          item_count={user.photo_count}
          onPress={onPressUser}
        />
      ))}
    </S.ContentContainer >
  );
}