import React, { useRef } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

import * as S from "../../styles";

export const Step3: React.FC = () => {
  const { t } = useTranslation();
  const animationRef = useRef<LottieView>(null);

  return (
    <S.CompleteContainer>
      <View
        style={{
          width: moderateScale(200),
          height: moderateScale(100),
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <LottieView
          ref={animationRef}
          source={require("../../../../../assets/lottie-animation.json")}
          autoPlay
          loop={false}
          style={{
            width: moderateScale(240),
            height: moderateScale(240),
          }}
        />
      </View>

      <S.Title style={{ textAlign: "center" }}>
        {t("PartnerRequestPage.completeTitle")}
      </S.Title>

      <S.Subtitle style={{ textAlign: "center", paddingHorizontal: moderateScale(32), paddingVertical: moderateScale(32) }}>
        {t("PartnerRequestPage.completeDescription")}
      </S.Subtitle>

      <S.Subtitle style={{ textAlign: "center", paddingHorizontal: moderateScale(32) }}>
        {t("PartnerRequestPage.completeDescription2")}
      </S.Subtitle>
    </S.CompleteContainer>
  );
};
