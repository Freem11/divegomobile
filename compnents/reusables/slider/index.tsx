import React, { useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import { useSharedValue } from "react-native-reanimated";

import { colors } from "../../styles";

import * as S from "./styles";
import { useCurrentAnimation } from "./currentSliderAnimation";
import { useGetCurrentLabel } from "./useGetCurrentLabel";

type SliderProps = {
  inverted?: boolean;
  title: React.ReactNode;
  leftValue: number
  rightValue: number
  unitMeasurement: string
  onValueChange: (value: number) => void;
};

export default function ReusableSlider(props: SliderProps) {
  const initialValue = props.inverted ? props.rightValue : props.leftValue;
  const progress = useSharedValue(initialValue);
  const [currentValue, setCurrentValue] = useState(initialValue);

  const animatedColor = useCurrentAnimation(progress, props.leftValue, props.rightValue, props.inverted, props.unitMeasurement);
  const currentLabel = useGetCurrentLabel(props.rightValue, currentValue);

  useEffect(() => {
    const newValue = props.inverted ? props.rightValue : props.leftValue;
    setCurrentValue(newValue);
    progress.value = newValue;
  }, [props.inverted, props.leftValue, props.rightValue]);

  return (
    <S.Wrapper>
      <S.TopRow>
        {props.title}
        <S.AnimatedLabel style={animatedColor}>
          {props.unitMeasurement === "m/s" || props.unitMeasurement === "ft/s" ? currentLabel : null} {currentValue.toFixed(1)} {props.unitMeasurement}
        </S.AnimatedLabel>
      </S.TopRow>
      <S.SliderRow>
        <S.EndMarkerLeft>{props.leftValue}</S.EndMarkerLeft>
        <Slider
          style={{ flex: 1 }}
          step={props.inverted ? 1 : 0.5}
          minimumValue={props.leftValue}
          maximumValue={props.rightValue}
          minimumTrackTintColor={colors.primaryBlue}
          maximumTrackTintColor={colors.buttonPressOverlay}
          thumbTintColor={colors.primaryBlue}
          onValueChange={(value) => {
            const adjustedValue = value;
            setCurrentValue(adjustedValue);
            props.onValueChange(adjustedValue);
            progress.value = adjustedValue;
          }}
          value={currentValue}
        />
        <S.EndMarkerRight>{`${props.rightValue}+`}</S.EndMarkerRight>
      </S.SliderRow>
    </S.Wrapper>
  );
}