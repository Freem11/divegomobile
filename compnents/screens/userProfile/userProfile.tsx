import React, { useEffect, useState } from "react";

import { ActiveProfile } from "../../../entities/profile";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { Review } from "../../../entities/diveSiteReview";
import SealifePreview from "../../reusables/sealifePreview";
import ReviewCard from "../../reusables/reviewCard";
import Label from "../../reusables/label-new";
import EmptyState from "../../reusables/emptyState-new";
import { useUserProfile } from "../../../store/user/useUserProfile";

import * as S from "./styles";

type UserProfileProps = {
  profilePhotos: DiveSiteWithUserName[] | null;
  selectedProfile: ActiveProfile | null;
  speciesCount: number;
  sightingsCount: number;
  reviewCount: number;
  openAllPhotosPage: () => void;
  handleDiveSiteMove: (name: string) => void;
  reviews: Review[];
};

export default function UserProfileScreenView({
  profilePhotos,
  selectedProfile,
  speciesCount,
  sightingsCount,
  reviewCount,
  openAllPhotosPage,
  handleDiveSiteMove,
  reviews
}: UserProfileProps) {

  const [profileVals, setProfileVals] = useState(null);
  const { userProfile } = useUserProfile();

  useEffect(() => {
    setProfileVals({
      userName: selectedProfile?.UserName,
      bio: selectedProfile?.profileBio,
    });

  }, [selectedProfile]);

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Header>{profileVals?.userName}</S.Header>
        <S.Content>{profileVals?.bio}</S.Content>
      </S.InputGroupContainer>

      <SealifePreview
        speciesCount={speciesCount}
        sightingsCount={sightingsCount}
        diveSitePics={profilePhotos}
        onViewMore={openAllPhotosPage}
        selectedProfile={selectedProfile}
      />

      <S.LabelWrapper>
        <Label label={"Dive Site Reviews"} />
      </S.LabelWrapper>

      <S.ReviewsWrapper>
        <S.Stats>{`${reviewCount} review${reviewCount === 1 ? "" : "s"}`}</S.Stats>
        {reviews && reviews.length > 0 ? (
          <S.ReviewsContent>
            {reviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                date={review.dive_date}
                description={review.description}
                conditions={review.conditions}
                name={review.divesite_name}
                photo={review.profilePhoto}
                review={review}
                currentUserId={userProfile.UserID}
                handleNavigate={handleDiveSiteMove}
                onEdit={() => { }}
                onDelete={() => { }}
              />
            ))}
          </S.ReviewsContent>
        ) : (
          <S.EmptyStateWrapper>
            <EmptyState
              iconName={"diving-scuba-flag"}
              title={"No Reviews Yet"}
              subtitle={`${profileVals?.userName || "This user"} hasn't written any dive reviews yet`}
            />
          </S.EmptyStateWrapper>
        )}
      </S.ReviewsWrapper>
    </S.ContentContainer>
  );
}
