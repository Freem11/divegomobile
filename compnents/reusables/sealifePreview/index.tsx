import React from "react";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { PreviewGrid } from "../previewGrid";
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";
import Label from "../label-new";
import Button from "../button";
import GhostButton from "../ghostButton";

import * as S from "./styles";

type SealifePreviewProps = {
  speciesCount: number
  sightingsCount: number
  diveSitePics: DiveSiteWithUserName[] | null
  onViewMore: () => void
  onAddSighting: () => void
};

export default function SealifePreview({
  speciesCount,
  sightingsCount,
  diveSitePics,
  onViewMore,
  onAddSighting,
}: SealifePreviewProps) {
  return (
    <>
      <S.LabelWrapper>
        <Label label={"Sea Life Sightings"} />
        <S.StatsRow>
          <S.StatsContainer>
            <S.StatRow>
              <Icon name="eye" fill={colors.darkGrey} style={{ width: 16, marginRight: 5 }} />
              <S.TotalCount>
                {sightingsCount ? `${sightingsCount} sightings` : null}
              </S.TotalCount>
            </S.StatRow>
            <S.StatRow>
              <Icon name="fish" fill={colors.darkGrey} style={{ width: 16, marginRight: 5 }} />
              <S.TotalCount>
                {speciesCount ? `${speciesCount} species` : null}
              </S.TotalCount>
            </S.StatRow>
          </S.StatsContainer>

          <Button
            size="thin"
            title={"Add More"}
            round={false}
            iconLeft="plus"
            style={{ width: "auto" }}
            onPress={onAddSighting}
          />
        </S.StatsRow>
      </S.LabelWrapper>

      <PreviewGrid items={diveSitePics} />

      <S.SectionFooterWrapper>
        <GhostButton onPress={onViewMore} title={'View More'} />
      </S.SectionFooterWrapper>
    </>
  );
}