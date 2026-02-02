import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { ReviewSingle } from "../../../entities/diveSiteReview";
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";
import Avatar from "../../reusables/reviewCard/avatarCreator";
import readableDate from "../../helpers/readableDate";
import { PhotoUpload } from "../formScreens/photoUpload";
import ConditionsCard from "../../reusables/condidtionsCard";
import { PhotoVariantSet } from "../../../entities/photoSizes";

import * as S from "./styles";

type DiveShopProps = {
  selectedReview: ReviewSingle;
  gestureRef?: any;
};

export default function ReviewScreenView({
  selectedReview,
  gestureRef
}: DiveShopProps) {

  const photos: PhotoVariantSet[] = selectedReview?.photos.map(({
    photoPath, public_domain, sm, md, lg, xl,
  }) => ({
    original_image: photoPath,
    public_domain,
    sm,
    md,
    lg,
    xl
  }));

  const avatarImage = `${selectedReview?.reviewer_public_domain}/${selectedReview?.reviewer_sm}`;

  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{selectedReview?.divesite_name}</S.Header>
      </S.InfoContainer>

      <S.StatRowMajor>
        <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(12) }}>
          <Avatar photo={avatarImage} />
          <S.Title>
            {selectedReview?.user_name}
          </S.Title>
        </View>

        <S.StatRow>
          <Icon name="calendar-month" fill={colors.primaryBlue} style={{ width: 40, height: 40, marginRight: 5 }} />
          <S.Title>
            {selectedReview && readableDate(selectedReview.dive_date)}
          </S.Title>
        </S.StatRow>
      </S.StatRowMajor>

      <S.Content>{selectedReview?.description}</S.Content>

      <PhotoUpload
        items={photos}
        gestureRef={gestureRef}
      />

      <ConditionsCard conditions={selectedReview?.conditions} />

    </S.ContentContainer>
  );
}