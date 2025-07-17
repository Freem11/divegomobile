import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import Button from "../../reusables/button";
import SealifePreview from "../../reusables/sealifePreview";
import Label from "../../reusables/label-new";

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
  const { t } = useTranslation();

  useEffect(() => {
    setSiteVals({
      siteName: selectedDiveSite.name,
      bio: selectedDiveSite.diveSiteBio,
      user: selectedDiveSite.newusername
    });

  },[selectedDiveSite]);

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Header>{siteVals?.siteName}</S.Header>
        <S.Content>{siteVals?.bio}</S.Content>
        {siteVals?.user && (
          <S.Contributor>Added by {siteVals?.user}</S.Contributor>
        )}
      </S.InputGroupContainer>

      <SealifePreview
        speciesCount={speciesCount}
        sightingsCount={sightingsCount}
        diveSitePics={diveSitePics}
        onViewMore={openAllPhotosPage}
        onAddSighting={openPicUploader}
      />

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
          size="thin"
          title={"View All"}
        />
      </S.ButtonWrapper>
    </S.ContentContainer>
  );
}

