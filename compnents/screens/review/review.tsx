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
import { IMAGE_SIZE } from "../../../entities/image";
import getImagePublicUrl from "../../helpers/getImagePublicUrl";

import * as S from "./styles";

type DiveShopProps = {
  selectedReview: ReviewSingle;
  gestureRef?: any;
};

export default function ReviewScreenView({
  selectedReview,
  gestureRef // 2. Destructure the prop
}: DiveShopProps) {

  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{selectedReview?.divesite_name}</S.Header>
      </S.InfoContainer>

      <S.StatRowMajor>
        <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(12) }}>
          <Avatar photo={getImagePublicUrl(selectedReview?.profilePhoto, IMAGE_SIZE.SM)} />
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
        items={selectedReview?.photos}
        gestureRef={gestureRef}
      />

      <ConditionsCard conditions={selectedReview?.conditions} />

    </S.ContentContainer>
  );
}