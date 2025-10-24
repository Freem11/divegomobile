import React from "react";
import { moderateScale } from "react-native-size-matters";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { ItineraryItem } from "../../../entities/itineraryItem";
import SealifePreview from "../../reusables/sealifePreview";
import ItineraryCard from "../../reusables/itineraryCard";
import GhostButton from "../../reusables/ghostButton";
import EmptyState from "../../reusables/emptyState-new";
import Label from "../../reusables/label";
import ReviewCard from "../../reusables/reviewCard";
import { Review } from "../../../entities/diveSiteReview";
import Button from "../../reusables/button";

import * as S from "./styles";

type DiveSiteProps = {
  selectedDiveSite: DiveSiteWithUserName
  diveSitePics: DiveSiteWithUserName[]
  speciesCount: number;
  sightingsCount: number;
  tripCount: number;
  itineraries: ItineraryItem[];
  reviews: Review[];
  openPicUploader: () => void;
  openDiveSiteReviewer: () => void;
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
  reviews,
  openPicUploader,
  openDiveSiteReviewer,
  openAllPhotosPage,
  openAllTripsPage,
  handleMapFlip
}: DiveSiteProps) {
  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Header>{selectedDiveSite?.name}</S.Header>
        <S.Content>{selectedDiveSite?.divesitebio}</S.Content>
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
        <Label label="Diver Reviews" />
      </S.LabelWrapper>

      <S.ReviewsWrapper>
        <S.Stats>{`${reviews.length } review${reviews.length  === 1 ? "": "s"}`}</S.Stats>

        {reviews && reviews.length > 0 ? (
          <S.ReviewsContent key="has-reviews">
            <S.ButtonContainerReviews>
              <Button
                size="thin"
                title={"Add My Review"}
                iconLeft="diving-scuba-flag"
                round={false}
                style={{ width: moderateScale(240), marginTop: moderateScale(15) }}
                onPress={() => openDiveSiteReviewer()}
              />
            </S.ButtonContainerReviews>

            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                date={review.dive_date}
                description={review.description}
                conditions={review.conditions}
                userName={review.user_name}
                photo={review.profilePhoto}
              />
            ))}
          </S.ReviewsContent>
        ) : (
          <S.EmptyStateWrapper key="no-reviews">
            <EmptyState
              iconName="diving-scuba-flag"
              title="No Reviews Here Yet"
              subtitle={`No one has left a review for ${selectedDiveSite?.name}`}
            />
            <S.ButtonContainer>
              <Button
                size="thin"
                title={"Add First Review"}
                iconLeft="diving-scuba-flag"
                round={false}
                style={{ width: moderateScale(240), marginTop: moderateScale(15) }}
                onPress={() => openDiveSiteReviewer()}
              />
            </S.ButtonContainer>
          </S.EmptyStateWrapper>
        )}
      </S.ReviewsWrapper>

      {reviews.length  > 0 && (
        <S.ButtonContainer>
          <GhostButton
            onPress={() => null}
            title={"View All Reviews"}
          />
        </S.ButtonContainer>
      )}

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
              iconName="diving-scuba-flag"
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

