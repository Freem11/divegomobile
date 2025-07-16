import { moderateScale } from "react-native-size-matters";
import React, { useEffect, useState } from "react";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { PreviewGrid } from "../../reusables/previewGrid";
import Label from "../../reusables/label-new";
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";

import * as S from "./styles";

type DiveSiteProps = {
  selectedDiveSite: DiveSiteWithUserName
  diveSitePics: DiveSiteWithUserName[]
  handleProfileMove: (userName: string) => void;
  sightingsCount: number;
  speciesCount: number;
};

export default function DiveSiteScreenView({
  selectedDiveSite,
  diveSitePics,
  sightingsCount,
  speciesCount,
  handleProfileMove,
}: DiveSiteProps) {

  const [siteVals, setSiteVals] = useState(null);

  useEffect(() => {
    setSiteVals({
      siteName: selectedDiveSite.name,
      bio: selectedDiveSite.diveSiteBio,
      user: selectedDiveSite.newusername
    })
  
  },[selectedDiveSite])

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Header>{siteVals?.siteName}</S.Header>

        <S.Content>{siteVals?.bio}</S.Content>
        {siteVals?.user && (
          <S.Contributor>Added by {siteVals?.user}</S.Contributor>
        )}

      </S.InputGroupContainer>

      <S.LabelWrapper>
        <Label label="Sealife Sightings" />
        <S.SectionCount>
          {speciesCount ? (
            `${speciesCount} species`
          ) : null}
        </S.SectionCount>
      </S.LabelWrapper>

      <PreviewGrid items={diveSitePics} />

      <S.SectionFooterWrapper>
        <S.TotalCount>
          {sightingsCount ? (
            `${sightingsCount} total sightings`
          ) : null}
        </S.TotalCount>
        <S.ViewMoreButton>
          <S.ViewMoreButtonText>
            {"View More"}
          </S.ViewMoreButtonText>
          <Icon 
            name="chevron-right" 
            width={moderateScale(24)}
            height={moderateScale(24)}
            fill={colors.primaryBlue}
          />
        </S.ViewMoreButton>
      </S.SectionFooterWrapper>
    </S.ContentContainer>
  );
}

