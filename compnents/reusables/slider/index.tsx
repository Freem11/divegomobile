import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useAnimatedStyle, useSharedValue, interpolateColor } from "react-native-reanimated";

import { colors } from "../../styles";

import * as S from "./styles";

type SliderProps = {
  sliderType: "viz" | "cur" | "normal";
  leftValue: number
  rightValue: number
  unitMeasurement: string
  onValueChange: (value: number) => void;
};

export default function ReusableSlider({
  sliderType,
  leftValue,
  rightValue,
  unitMeasurement,
  onValueChange
}: SliderProps) {
  const inverted = sliderType === "viz";

  const [currentValue, setCurrentValue] = useState(inverted ? rightValue : leftValue);
  const progress = useSharedValue(inverted ? rightValue : leftValue);
  const [currentLabel, setCurrentLabel] = useState("");

  useEffect(() => {
    const newValue = inverted ? rightValue : leftValue;
    setCurrentValue(newValue);
    progress.value = newValue;
    getCurrentLabel(newValue, rightValue);
  }, [inverted, leftValue, rightValue]);

  const getCurrentLabel = (value, rightValue) => {
    if (rightValue <= 0) {
      setCurrentLabel("");
      return;
    }

    const onePercent = rightValue / 100;

    if (value === 0) {
      setCurrentLabel("");
    } else if (value > 0 && value <= onePercent*20) {
      setCurrentLabel("Weak Drift");
    } else if (value >= onePercent*20 && value <= onePercent*40) {
      setCurrentLabel("Typical Drift");
    } else if (value >= onePercent*40 && value <= onePercent*60) {
      setCurrentLabel("Strong Drift");
    } else if (value >= onePercent*60) {
      setCurrentLabel("Extreme Drift");
    } else {
      setCurrentLabel("");
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedColor = interpolateColor(
      progress.value,
      [leftValue, rightValue * 0.25, rightValue * 0.5, rightValue * 0.75, rightValue],
      ["#007BFF", "#6F42C2", "#DC3545", "red", "#FF0000"]
    );
    return {
      color: interpolatedColor,
    };
  });

  return (
    <S.Wrapper>
      <View style={{ marginBottom: 10 }}>
        <S.AnimatedLabel style={unitMeasurement === "m/s" || unitMeasurement === "ft/s" ? animatedStyle : null}>
          {currentValue.toFixed(1)} {unitMeasurement} {unitMeasurement === "m/s" || unitMeasurement === "ft/s" ? currentLabel : null}
        </S.AnimatedLabel>
      </View>
      <S.SliderWrapper>
        <S.EndMarker>{inverted ? `${rightValue}+` : leftValue}</S.EndMarker>
        <Slider
          style={{ width: "90%", height: 40 }}
          step={inverted? 1 : 0.5}
          minimumValue={leftValue}
          maximumValue={rightValue}
          minimumTrackTintColor={colors.neutralGrey}
          maximumTrackTintColor={colors.neutralGrey}
          thumbTintColor={colors.primaryBlue}
          onValueChange={(value) => {
            const adjustedValue = inverted ? leftValue + rightValue - value : value;
            setCurrentValue(adjustedValue);
            onValueChange(adjustedValue);
            getCurrentLabel(adjustedValue, rightValue);
            progress.value = adjustedValue;
          }}
          value={inverted ? leftValue + rightValue - currentValue : currentValue}
        />
        <S.EndMarker>{inverted ? leftValue : `${rightValue}+`}</S.EndMarker>
      </S.SliderWrapper>
    </S.Wrapper>
  );
}