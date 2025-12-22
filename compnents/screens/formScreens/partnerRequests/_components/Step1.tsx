import React, { useRef } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

import * as S from "../../styles";

export const Step1: React.FC = () => {
  const { t } = useTranslation();
  const animationRef = useRef<LottieView>(null);

  return (
    <S.CompleteContainer>

      <S.NoticeTitle >
        {t("PartnerRequestPage.step1Title")}
      </S.NoticeTitle>

      <S.NoticeSubtitle style={{ textAlign: "center", paddingHorizontal: moderateScale(32), paddingVertical: moderateScale(32) }}>
        {t("PartnerRequestPage.step1Description")}
      </S.NoticeSubtitle>

      <S.NoticeSubtitle style={{ textAlign: "center", paddingHorizontal: moderateScale(32) }}>
        {t("PartnerRequestPage.step1Description2")}
      </S.NoticeSubtitle>
    </S.CompleteContainer>
  );
};
