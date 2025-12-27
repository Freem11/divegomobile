import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import { ReviewSingle } from "../../../entities/diveSiteReview";
import Icon from "../../../icons/Icon";
import { colors } from "../../styles";
import { cloudflareBucketUrl } from "../../globalVariables";
import Avatar from "../../reusables/reviewCard/avatarCreator";
import readableDate from "../../helpers/readableDate";

import * as S from "./styles";

type DiveShopProps = {
  selectedReview: ReviewSingle;
};

export default function ReviewScreenView({ selectedReview }: DiveShopProps) {

  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{selectedReview?.divesite_name}</S.Header>
      </S.InfoContainer>

      <S.StatRowMajor>
        <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(12) }}>
          <Avatar photo={`${cloudflareBucketUrl}${selectedReview?.profilePhoto.split("/").pop()}`} />
          <S.Title>
            {selectedReview?.user_name}
          </S.Title>
        </View>

        <S.StatRow>
          <Icon name="calendar-month" fill={colors.primaryBlue} style={{ width: 42, height: 42, marginRight: 5 }} />
          <S.Title>
            {selectedReview && readableDate(selectedReview.dive_date)}
          </S.Title>
        </S.StatRow>
      </S.StatRowMajor>

    </S.ContentContainer>
  );
}
