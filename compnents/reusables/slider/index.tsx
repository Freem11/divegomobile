import Animated, { useSharedValue, useAnimatedStyle, interpolate } from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

import * as S from "./styles";
import { useGetCurrentLabel } from "./useGetCurrentLabel";

type SliderProps = {
  inverted?: boolean;
  title: string;
  leftValue: number;
  rightValue: number;
  unitMeasurement: string;
  onValueChange: (value: number) => void;
};

export default function ReusableSlider(props: SliderProps) {
  const initialValue = props.inverted ? props.rightValue : props.leftValue;
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [liveValue, setLiveValue] = useState(initialValue);

  const progress = useSharedValue(initialValue);

  const currentLabel = useGetCurrentLabel(props.rightValue, liveValue);

  useEffect(() => {
    const newValue = props.inverted ? props.rightValue : props.leftValue;
    setCurrentValue(newValue);
    setLiveValue(newValue);
    progress.value = newValue;
  }, [props.inverted, props.leftValue, props.rightValue]);

  const animatedGradientStyle = useAnimatedStyle(() => {
    const progressPercentage = interpolate(
      progress.value,
      [props.leftValue, props.rightValue],
      [0, 1]
    );

    return {
      width: `${progressPercentage * 100}%`,
    };
  });

  return (
    <S.Wrapper>
      <S.TopRow>
        <S.Label>{props.title}</S.Label>
        <S.AnimatedLabel>
          <S.LabelTag>
          <S.LabelTagText>
            {(props.unitMeasurement === "m/s" || props.unitMeasurement === "ft/s") ? `${currentLabel} ` : ''}
            {liveValue.toFixed(1)} {props.unitMeasurement}
            </S.LabelTagText>
          </S.LabelTag>
        </S.AnimatedLabel>
      </S.TopRow>

      <S.SliderRow>
        <S.EndMarkerLeft>{props.leftValue}</S.EndMarkerLeft>

        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              height: moderateScale(8),
              backgroundColor: "rgb(230,230,230)",
              borderRadius: moderateScale(8),
              position: "absolute",
              width: "100%",
            }}
          />

          {/* Animated gradient fill */}
          <Animated.View
            style={[
              {
                height: 10,
                borderRadius: 5,
                overflow: "hidden",
                position: "absolute",
              },
              animatedGradientStyle,
            ]}
          >
            <LinearGradient
              colors={["#6FF6EF", "#1669F9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <Slider
            style={{ flex: 1, height: moderateScale(10) }}
            step={props.inverted ? 1 : 0.5}
            minimumValue={props.leftValue}
            maximumValue={props.rightValue}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor="#0B63FB"
            onValueChange={(value) => {
              progress.value = value;
              setLiveValue(value);
            }}
            onSlidingComplete={(value) => {
              setCurrentValue(value);
              props.onValueChange(value);
            }}
            value={liveValue}
          />
        </View>

        <S.EndMarkerRight>{`${props.rightValue}+`}</S.EndMarkerRight>
      </S.SliderRow>
    </S.Wrapper>
  );
}
