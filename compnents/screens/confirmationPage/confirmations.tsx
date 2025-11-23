import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";

import { useDiveShopNavigation } from "../diveShop/types";

import * as S from "./styles";

interface Step4Props {
  title: string
  subTitle: string
}

export default function Confirmations(props: Step4Props) {
  const { t } = useTranslation();
  const animationRef = useRef<LottieView>(null);
  const diveShopNavigation = useDiveShopNavigation();

  useEffect(() => {
    setTimeout(() => {
      diveShopNavigation.navigate("DiveCentre");
    }, 3000);
  }, []);

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
          source={require("../../../assets/lottie-animation.json")}
          autoPlay
          loop={false}
          style={{
            width: moderateScale(240),
            height: moderateScale(240),
          }}
        />
      </View>

      <S.Title style={{ textAlign: "center" }}>
        {props.title}
      </S.Title>

      <S.Subtitle style={{ textAlign: "center", paddingHorizontal: moderateScale(32) }}>
        {props.subTitle}
      </S.Subtitle>
    </S.CompleteContainer>
  );
};
