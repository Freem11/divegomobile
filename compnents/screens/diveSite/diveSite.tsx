import React from "react";
import { moderateScale } from "react-native-size-matters";

import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { ItineraryItem } from "../../../entities/itineraryItem";
import SealifePreview from "../../reusables/sealifePreview";
import ItineraryCard from "../../reusables/itineraryCard";
import GhostButton from "../../reusables/ghostButton";
import EmptyState from "../../reusables/emptyState-new";
import Label from "../../reusables/label-new";
import ReviewCard from "../../reusables/reviewCard";
import { Review } from "../../../entities/diveSiteReview";
import Button from "../../reusables/button";
import { MetricItem } from "../../../entities/metricItem";
import { PhotoVariantSet } from "../../../entities/photoSizes";

import * as S from "./styles";
import { renderStatLabel } from "./statsLabels";

type DiveSiteProps = {
  selectedDiveSite: DiveSiteWithUserName
  diveSitePics: PhotoVariantSet[]
  speciesCount: number;
  sightingsCount: number;
  tripCount: number;
  metricInfo: MetricItem[];
  itineraries: ItineraryItem[];
  reviews: Review[];
  currentUserId?: string;
  openPicUploader: () => void;
  openDiveSiteReviewer: () => void;
  openAllPhotosPage: () => void;
  openAllTripsPage: () => void;
  handleProfileMove: (name: string, id: string | number) => void;
  handleMapFlip: (sites: number[]) => void;
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: number) => void;
};

export default function DiveSiteScreenView({
  selectedDiveSite,
  diveSitePics,
  speciesCount,
  sightingsCount,
  tripCount,
  metricInfo,
  itineraries,
  reviews,
  currentUserId,
  openPicUploader,
  openDiveSiteReviewer,
  openAllPhotosPage,
  openAllTripsPage,
  handleProfileMove,
  handleMapFlip,
  onEditReview,
  onDeleteReview
}: DiveSiteProps) {

  //1 = shore dive -> if present yes
  //2 = boat dive -> no need to show
  //3 = night dive -> if present yes
  //4 = altitude -> if present yes
  //5 = wreck -> if present yes
  //6 = cave -> if present yes
  //7 = salt water -> no need to show
  //8 = fresh water -> if present yes
  //9 = surface traffic -> if present yes
  //10 = surge -> if present yes
  //11 = no ref points -> if present yes
  //12 = bottom depth -> if present yes
  //13 = kelp -> if present yes
  //14 = pollution -> if present yes
  //15 = viz -> generally x viz
  //16 = current intensity -> generally x currents
  //17 = latteral -> most common of the 4
  //18 = upwelling -> most common of the 4
  //19 = downwelling -> most common of the 4
  //20 = contrasting -> most common of the 4

  const customOrder = [8, 1, 5, 4, 6, 12, 15, 20, 19, 18, 17, 13, 3, 9, 10, 11, 14];

  console.log("reviews", reviews);
  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Header>{selectedDiveSite?.name}</S.Header>
        {selectedDiveSite?.newUserName && (
          <S.Contributor>Added by {selectedDiveSite?.newUserName}</S.Contributor>
        )}
        <S.LabelsContainer>
          {metricInfo &&
            [...metricInfo]
              .sort((a, b) => {
                const idA = a.condition_id;
                const idB = b.condition_id;

                const positionA = customOrder.indexOf(idA);
                const positionB = customOrder.indexOf(idB);

                return positionA - positionB;
              }).map((metric) => {
                const label = renderStatLabel({
                  condition_entry_id: metric.condition_id,
                  condition_type_id: metric.condition_id,
                  value: metric.sum_value_other ?? metric.average_value_15_16
                });

                if (label) {
                  return (
                    <S.TagWrapper key={`${metric.condition_id}-${metric.divesite_id}-${metric.review_month}`}>
                      <S.TagText>{label}</S.TagText>
                    </S.TagWrapper>
                  );
                }

              })}

        </S.LabelsContainer>

        <S.Content>{selectedDiveSite?.divesitebio}</S.Content>

      </S.InputGroupContainer>

      <SealifePreview
        speciesCount={speciesCount}
        sightingsCount={sightingsCount}
        photoVariants={diveSitePics}
        onViewMore={openAllPhotosPage}
        onAddSighting={openPicUploader}
        selectedProfile={null}
      />

      <S.LabelWrapper>
        <Label label="Diver Reviews" />
      </S.LabelWrapper>

      <S.ReviewsWrapper>
        <S.Stats>{`${reviews.length} review${reviews.length === 1 ? "" : "s"}`}</S.Stats>

        {reviews && reviews.length > 0 ? (
          <S.ReviewsContent key="has-reviews">
            <S.ButtonContainerReviews>
              <Button
                size="thin"
                title={"Add My Review"}
                iconLeft="diving-scuba-flag"
                round={false}
                style={{ width: moderateScale(240) }}
                onPress={() => openDiveSiteReviewer()}
              />
            </S.ButtonContainerReviews>

            {reviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                date={review.dive_date}
                description={review.description}
                conditions={review.conditions}
                name={review.user_name}
                photo={`${review.public_domain}/${review.sm}`}
                id={review.user_id}
                review={review}
                currentUserId={currentUserId}
                handleNavigate={handleProfileMove}
                onEdit={onEditReview}
                onDelete={onDeleteReview}
              />
            ))}
          </S.ReviewsContent>
        ) : (
          <S.EmptyStateWrapper key="no-reviews">
            <EmptyState
              iconName="diving-snorkel"
              title="No Reviews Here Yet"
              subtitle={`No one has left a review for ${selectedDiveSite?.name}`}
            />
            <S.ButtonContainer>
              <Button
                size="thin"
                title={"Add First Review"}
                iconLeft="diving-snorkel"
                round={false}
                style={{ width: moderateScale(240) }}
                onPress={() => openDiveSiteReviewer()}
              />
            </S.ButtonContainer>
          </S.EmptyStateWrapper>
        )}
      </S.ReviewsWrapper>

      {reviews.length > 0 && (
        <S.ButtonContainer>
          {/* <GhostButton
            onPress={() => null}
            title={"View All Reviews"}
          /> */}
        </S.ButtonContainer>
      )}

      <S.LabelWrapper>
        <Label label="Dive Trips" />
      </S.LabelWrapper>

      <S.ItinerariesWrapper>
        <S.Stats>{`${tripCount} active trip${tripCount === 1 ? "" : "s"}`}</S.Stats>

        {itineraries && itineraries.length > 0 ? itineraries.map((itinerary) => (
          <ItineraryCard
            key={itinerary.id}
            itinerary={itinerary}
            handleEdit={() => { }}
            handleDelete={() => { }}
            handleMapFlip={() => handleMapFlip(itinerary.siteList)}
            handleBooking={() => { }}
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

