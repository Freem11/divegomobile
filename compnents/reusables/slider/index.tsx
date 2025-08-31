import React, { useState, useEffect } from "react";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { View, StyleSheet } from "react-native";

import { colors } from "../../styles";

import * as S from "./styles";
import { useCurrentAnimation } from "./currentSliderAnimation";
import { useGetCurrentLabel } from "./useGetCurrentLabel";

type SliderProps = {
  inverted?: boolean;
  title: React.ReactNode;
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

  const animatedColor = useCurrentAnimation(
    progress,
    props.leftValue,
    props.rightValue,
    props.inverted,
    props.unitMeasurement
  );

  const currentLabel = useGetCurrentLabel(props.rightValue, liveValue);

  useEffect(() => {
    const newValue = props.inverted ? props.rightValue : props.leftValue;
    setCurrentValue(newValue);
    setLiveValue(newValue);
    progress.value = newValue;
  }, [props.inverted, props.leftValue, props.rightValue]);

  // Animated style for gradient fill width
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
        {props.title}
        <S.AnimatedLabel style={animatedColor}>
          {(props.unitMeasurement === "m/s" || props.unitMeasurement === "ft/s") && currentLabel}{" "}
          {liveValue.toFixed(1)} {props.unitMeasurement}
        </S.AnimatedLabel>
      </S.TopRow>

      <S.SliderRow>
        <S.EndMarkerLeft>{props.leftValue}</S.EndMarkerLeft>

        <View style={{ flex: 1, justifyContent: "center" }}>
          {/* Max track (gray background) */}
          <View
            style={{
              height: 10, // thicker track height
              backgroundColor: colors.buttonPressOverlay,
              borderRadius: 5,
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
              colors={["#33ccff", "#0099ff", "#0066ff", "#0033cc", "#001a66"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Slider with transparent min track */}
          <Slider
            style={{ flex: 1, height: 40 }} // taller for better alignment
            step={props.inverted ? 1 : 0.5}
            minimumValue={props.leftValue}
            maximumValue={props.rightValue}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            thumbTintColor={colors.primaryBlue}
            onValueChange={(value) => {
              progress.value = value;
              setLiveValue(value);
            }}
            onSlidingComplete={(value) => {
              setCurrentValue(value);
              props.onValueChange(value);
            }}
            value={currentValue}
          />
        </View>

        <S.EndMarkerRight>{`${props.rightValue}+`}</S.EndMarkerRight>
      </S.SliderRow>
    </S.Wrapper>
  );
}
