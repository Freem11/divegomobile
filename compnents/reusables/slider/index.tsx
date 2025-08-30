import React, { useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import { useSharedValue } from "react-native-reanimated";

import { colors } from "../../styles";

import * as S from "./styles";
import { useCurrentAnimation } from "./currentSliderAnimation";
import { useGetCurrentLabel } from "./useGetCurrentLabel";

type SliderProps = {
  inverted?: boolean;
  leftValue: number
  rightValue: number
  unitMeasurement: string
  onValueChange: (value: number) => void;
};

export default function ReusableSlider(props: SliderProps) {

  const progress = useSharedValue(props.inverted ? props.rightValue : props.leftValue);
  const [currentValue, setCurrentValue] = useState(props.inverted ? props.rightValue : props.leftValue);
  const animatedColor = useCurrentAnimation(progress, props.leftValue, props.rightValue, props.inverted, props.unitMeasurement);
  const currentLabel = useGetCurrentLabel(props.rightValue, currentValue);

  useEffect(() => {
    const newValue = props.inverted ? props.rightValue : props.leftValue;
    setCurrentValue(newValue);
    progress.value = newValue;
  }, [props.inverted, props.leftValue, props.rightValue]);

  return (
    <S.Wrapper>
      <S.AnimatedLabel style={animatedColor}>
        {currentValue.toFixed(1)} {props.unitMeasurement} {props.unitMeasurement === "m/s" || props.unitMeasurement === "ft/s" ? currentLabel : null}
      </S.AnimatedLabel>
      <S.SliderWrapper>
        <S.EndMarker>{props.inverted ? `${props.rightValue}+` : props.leftValue}</S.EndMarker>
        <Slider
          style={{ width: "90%" }}
          step={props.inverted? 1 : 0.5}
          minimumValue={props.leftValue}
          maximumValue={props.rightValue}
          minimumTrackTintColor={colors.neutralGrey}
          maximumTrackTintColor={colors.neutralGrey}
          thumbTintColor={colors.primaryBlue}
          onValueChange={(value) => {
            const adjustedValue = props.inverted ? props.leftValue + props.rightValue - value : value;
            setCurrentValue(adjustedValue);
            props.onValueChange(adjustedValue);
            progress.value = adjustedValue;
          }}
          value={props.inverted ? props.leftValue + props.rightValue - currentValue : currentValue}
        />
        <S.EndMarker>{props.inverted ? props.leftValue : `${props.rightValue}+`}</S.EndMarker>
      </S.SliderWrapper>
    </S.Wrapper>
  );
}