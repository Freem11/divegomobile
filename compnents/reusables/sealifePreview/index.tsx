import React from "react";
import { moderateScale } from "react-native-size-matters";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { PreviewGrid } from "../previewGrid";
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";
// import Label from "../label-new";
import Button from "../button";
import GhostButton from "../ghostButton";
import EmptyState from "../emptyState-new";

import * as S from "./styles";
import Label from "../label";
import { ActiveProfile } from "../../../entities/profile";

type SealifePreviewProps = {
  speciesCount: number
  sightingsCount: number
  diveSitePics: DiveSiteWithUserName[] | null
  onViewMore: () => void
  onAddSighting: () => void
  selectedProfile: ActiveProfile | null
};

export default function SealifePreview({
  speciesCount,
  sightingsCount,
  diveSitePics,
  onViewMore,
  onAddSighting,
  selectedProfile
}: SealifePreviewProps) {

  return (
    <>
      <S.LabelWrapper>
        <Label label={"Sea Life Sightings"} />
        <S.StatsContainer>
          <S.StatRow>
            <Icon name="eye" fill={colors.darkGrey} style={{ width: 16, marginRight: 5 }} />
            <S.TotalCount>
              {sightingsCount ? `${sightingsCount} sightings` : "0 sightings"}
            </S.TotalCount>
          </S.StatRow>
          <S.StatRow>
            <Icon name="fish" fill={colors.darkGrey} style={{ width: 16, marginRight: 5 }} />
            <S.TotalCount>
              {speciesCount ? `${speciesCount} species` : "0 species"}
            </S.TotalCount>
          </S.StatRow>
        </S.StatsContainer>
      </S.LabelWrapper>

      {sightingsCount > 0 ? (
        <>
          <PreviewGrid items={diveSitePics} />
          <S.SectionFooterWrapper>
          {!selectedProfile && <GhostButton onPress={onAddSighting} title={"Add a Sighting"} />} 
          <GhostButton onPress={onViewMore} title={"View More"} />
          </S.SectionFooterWrapper>
        </>
      ) : (
        <S.EmptyStateContainer>
          <EmptyState
            iconName="fish"
            title={selectedProfile ? null : "No sightings yet"}
            subtitle={selectedProfile ? `${selectedProfile.UserName} hasn't made any sightings yet.` : "Be the first to spot some sea life here!"}
          />
         {!selectedProfile &&
         <Button
         size="thin"
         title={"Add First Sighting"}
         iconLeft="camera-plus"
         round={false}
         style={{ width: "auto", marginTop: moderateScale(15) }}
         onPress={onAddSighting}
       />} 
        </S.EmptyStateContainer>
      )}
    </>
  );
}