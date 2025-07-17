import React, { useEffect, useState } from "react";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import Button from "../../reusables/button";
import { PreviewGrid } from "../../reusables/previewGrid";
import Label from "../../reusables/label-new";
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";

import * as S from "./styles";

type DiveSiteProps = {
  selectedDiveSite: DiveSiteWithUserName
  diveSitePics: DiveSiteWithUserName[]
  speciesCount: number;
  sightingsCount: number;
  tripCount: number;
  openPicUploader: () => void;
  openAllPhotosPage: () => void;
  openAllTripsPage: () => void;
};

export default function DiveSiteScreenView({
  selectedDiveSite,
  diveSitePics,
  speciesCount,
  sightingsCount,
  tripCount,
  openPicUploader,
  openAllPhotosPage,
  openAllTripsPage
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

      <S.ButtonWrapper>

        <Button
          onPress={() => openPicUploader()}
          alt={false}
          size='thin'
          title={t('DiveSite.addSighting')}
        />

        <Button
          onPress={() => openAllPhotosPage()}
          alt={false}
          size='thin'
          title={'View All'}
        />

      </S.ButtonWrapper>

      <S.LabelWrapper>
        <Label label="Dive Trips" />
      </S.LabelWrapper>

      <S.StatWrapper>
        <S.Stats>{tripCount} Active Trips</S.Stats>
      </S.StatWrapper>

      <S.ButtonWrapper>
        <Button
          onPress={() => openAllTripsPage()}
          alt={false}
          size='thin'
          title={'View All'}
        />
      </S.ButtonWrapper>
    </S.ContentContainer>
  );
}

