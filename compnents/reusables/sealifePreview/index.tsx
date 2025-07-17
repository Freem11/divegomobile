import React from "react";
import { moderateScale } from "react-native-size-matters";
import { View } from "react-native";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { PreviewGrid } from "../previewGrid";
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";
import Label from "../label-new";
import Button from "../button";

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
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: moderateScale(6) }}>
          <View>
            <View style={{ flexDirection: "row", marginBottom: moderateScale(2) }}>
              <Icon name="eye" fill={colors.darkGrey} style={{ width: 16, marginRight: 5 }} />
              <S.TotalCount>
                {sightingsCount ? `${sightingsCount} sightings` : null}
              </S.TotalCount>
            </View>
            <View style={{ flexDirection: "row", marginBottom: moderateScale(2) }}>
              <Icon name="fish" fill={colors.darkGrey} style={{ width: 16, marginRight: 5 }} />
              <S.TotalCount>
                {speciesCount ? `${speciesCount} species` : null}
              </S.TotalCount>
            </View>
          </View>

          <Button
            size="thin"
            title={"Add More"}
            round={false}
            iconLeft="plus"
            style={{ width: "auto" }}
            onPress={onAddSighting}
          />
        </View>
      </S.LabelWrapper>

      <PreviewGrid items={diveSitePics} />

      <S.SectionFooterWrapper>
        <S.ViewMoreButton onPress={onViewMore}>
          <S.ViewMoreButtonText>
            {"View More"}
          </S.ViewMoreButtonText>
          <Icon
            name={"chevron-right"}
            width={moderateScale(24)}
            height={moderateScale(24)}
            fill={colors.primaryBlue}
          />
        </S.ViewMoreButton>
      </S.SectionFooterWrapper>
    </>
  );
}