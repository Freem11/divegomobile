import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { ItineraryItem } from "../../../entities/itineraryItem";
import SealifePreview from "../../reusables/sealifePreview";
import Label from "../../reusables/label-new";
import ItineraryCard from "../../reusables/itineraryCard";

import * as S from "./styles";
import GhostButton from "../../reusables/ghostButton";

type DiveSiteProps = {
  selectedDiveSite: DiveSiteWithUserName
  diveSitePics: DiveSiteWithUserName[]
  speciesCount: number;
  sightingsCount: number;
  tripCount: number;
  itineraries: ItineraryItem[];
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
  itineraries,
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


      <S.ItinerariesWrapper>
        <S.Stats>{`${tripCount} active trip${tripCount > 1 ? "s": ""}`}</S.Stats>

        {itineraries && itineraries.map((itinerary) => (
          <ItineraryCard
            key={itinerary.id}
            itinerary={itinerary}
            handleEdit={() => {}}
            handleDelete={() => {}}
            handleMapFlip={() => {}}
            handleBooking={() => {}}
          />
        ))}
      </S.ItinerariesWrapper>
      
      {tripCount > 3 && (
        <S.ButtonContainer>
          <GhostButton
            onPress={() => openAllTripsPage()}
            title={"View All Trips"}
          />
        </S.ButtonContainer>
      )}
    </S.ContentContainer>
  );
}

