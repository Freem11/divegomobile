import React from "react";
import { useTranslation } from "react-i18next";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { ItineraryItem } from "../../../entities/itineraryItem";
import SealifePreview from "../../reusables/sealifePreview";
import ItineraryCard from "../../reusables/itineraryCard";
import GhostButton from "../../reusables/ghostButton";
import EmptyState from "../../reusables/emptyState-new";

import * as S from "./styles";
import Label from "../../reusables/label";

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
  handleMapFlip: (sites: number[]) => void;
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
  openAllTripsPage,
  handleMapFlip
}: DiveSiteProps) {

  const { t } = useTranslation();

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Header>{selectedDiveSite?.name}</S.Header>
        <S.Content>{selectedDiveSite?.diveSiteBio}</S.Content>
        {selectedDiveSite?.newusername && (
          <S.Contributor>Added by {selectedDiveSite?.newusername}</S.Contributor>
        )}
      </S.InputGroupContainer>

      <SealifePreview
        speciesCount={speciesCount}
        sightingsCount={sightingsCount}
        diveSitePics={diveSitePics}
        onViewMore={openAllPhotosPage}
        onAddSighting={openPicUploader}
        selectedProfile={null}
      />

      <S.LabelWrapper>
        <Label label="Dive Trips" />
      </S.LabelWrapper>

      <S.ItinerariesWrapper>
        <S.Stats>{`${tripCount} active trip${tripCount === 1 ? "": "s"}`}</S.Stats>

        {itineraries && itineraries.length > 0 ? itineraries.map((itinerary) => (
          <ItineraryCard
            key={itinerary.id}
            itinerary={itinerary}
            handleEdit={() => {}}
            handleDelete={() => {}}
            handleMapFlip={() => handleMapFlip(itinerary.siteList)}
            handleBooking={() => {}}
          />
        )) : (
          <S.EmptyStateWrapper>
            <EmptyState
              iconName="boat"
              title="No Trips Available"
              subtitle="There are currently no diving trips scheduled for this location. Check back later!"
            />
          </S.EmptyStateWrapper>
        )}
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

