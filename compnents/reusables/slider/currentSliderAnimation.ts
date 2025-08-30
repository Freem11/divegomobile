import { useAnimatedStyle, interpolateColor, SharedValue } from "react-native-reanimated";

export const useCurrentAnimation = (
  progress: SharedValue<number>,
  leftValue: number,
  rightValue: number,
  inverted: boolean,
  unitMeasurement: string
) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (unitMeasurement === "m/s" || unitMeasurement === "ft/s") {
      const inputRange = inverted
        ? [rightValue, rightValue * 0.75, rightValue * 0.5, rightValue * 0.25, leftValue]
        : [leftValue, leftValue + (rightValue - leftValue) * 0.25, leftValue + (rightValue - leftValue) * 0.5, leftValue + (rightValue - leftValue) * 0.75, rightValue];

      const interpolatedColor = interpolateColor(
        progress.value,
        inputRange,
        ["#007BFF", "#6F42C2", "#BF40BF", "#DC143C", "#ff000d"]
      );

      return {
        color: interpolatedColor,
      };
    }

    return { color: "black" };
  });

  return animatedStyle;
};