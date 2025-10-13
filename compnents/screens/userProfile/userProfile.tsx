import React, { useEffect, useState } from "react";

import { Photo } from "../../../entities/photos";
import { ActiveProfile } from "../../../entities/profile";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { Review } from "../../../entities/diveSiteReview";
import SealifePreview from "../../reusables/sealifePreview";
import ReviewCard from "../../reusables/reviewCard";
import Label from "../../reusables/label-new";
import EmptyState from "../../reusables/emptyState-new";

import * as S from "./styles";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";

type UserProfileProps = {
  profilePhotos: DiveSiteWithUserName[] | null;
  handleDiveSiteMove: (pic: Photo, photoPacket: any) => void;
  selectedProfile: ActiveProfile | null;
  speciesCount: number;
  sightingsCount: number;
  openAllPhotosPage: () => void;
  setLevelThreeScreen: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
};

export default function UserProfileScreenView({
  profilePhotos,
  selectedProfile,
  speciesCount,
  sightingsCount,
  openAllPhotosPage,
  setLevelThreeScreen,
  reviews
}: UserProfileProps) {

  const [profileVals, setProfileVals] = useState(null);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  
  useEffect(() => {
    setProfileVals({
      userName: selectedProfile?.UserName,
      bio: selectedProfile?.profileBio,
    });

  },[selectedProfile]);

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
        <Label label={'Recent Reviews'} />
      </S.LabelWrapper>

      <S.ReviewsWrapper>
        {reviews && reviews.length > 0 ? (
          <S.ReviewsContent>
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
          <S.EmptyStateWrapper>
            <EmptyState
              iconName={'diving-scuba-flag'}
              title={'No Reviews Yet'}
              subtitle={`${profileVals?.userName || 'This user'} hasn't written any dive reviews yet`}
            />
          </S.EmptyStateWrapper>
        )}
      </S.ReviewsWrapper>
    </S.ContentContainer>
  );
}
