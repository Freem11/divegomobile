import { useAnimatedStyle, interpolateColor, SharedValue } from "react-native-reanimated";

export const useCurrentAnimation = (
  progress: SharedValue<number>,
  leftValue: number,
  rightValue: number,
  inverted: boolean,
  unitMeasurement: string
) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (unitMeasurement === "m/s") {
      const inputRange = inverted
        ? [rightValue, rightValue * 0.75, rightValue * 0.5, rightValue * 0.25, leftValue]
        : [leftValue, leftValue + (rightValue - leftValue) * 0.25, leftValue + (rightValue - leftValue) * 0.5, leftValue + (rightValue - leftValue) * 0.75, rightValue];

      const interpolatedColor = interpolateColor(
        progress.value,
        inputRange,
        ["black", "#007BFF", "#007BFF", "#007BFF", "#ff000d"]
      );

      return {
        color: interpolatedColor,
      };
    } else if (unitMeasurement === "ft/s") {
      const ftInputRange = inverted
        ? [rightValue, rightValue * 0.95, rightValue * 0.9, rightValue * 0.85, rightValue * 0.8, rightValue * 0.75, rightValue * 0.7, rightValue * 0.65, rightValue * 0.6, rightValue * 0.55, rightValue * 0.5, rightValue * 0.45, rightValue * 0.4, leftValue]
        : [leftValue, leftValue + (rightValue - leftValue) * 0.05, leftValue + (rightValue - leftValue) * 0.1, leftValue + (rightValue - leftValue) * 0.15, leftValue + (rightValue - leftValue) * 0.2, leftValue + (rightValue - leftValue) * 0.25, leftValue + (rightValue - leftValue) * 0.3, leftValue + (rightValue - leftValue) * 0.35, leftValue + (rightValue - leftValue) * 0.4, leftValue + (rightValue - leftValue) * 0.45, leftValue + (rightValue - leftValue) * 0.5, leftValue + (rightValue - leftValue) * 0.55, leftValue + (rightValue - leftValue) * 0.6, rightValue];

      const ftOutputRange = [
        "black", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#007BFF", "#ff000d"
      ];
      const interpolatedColor = interpolateColor(
        progress.value,
        ftInputRange,
        ftOutputRange
      );

      return {
        color: interpolatedColor,
      };
    }

    return { color: "black" };
  });

  return animatedStyle;
};