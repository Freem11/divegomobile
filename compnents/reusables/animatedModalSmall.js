import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function AnimatedModalSmall(props) {
  const { onClose } = props;
  const [isPressed, setIsPressed] = useState(false);

  const smallModalY = useSharedValue(scale(1200));

  const modalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: smallModalY.value }],
    };
  });

  const modalClose = () => {
    smallModalY.value = withTiming(scale(1200));
  };

  return (
    <Animated.View
      style={[styles.confirmationBox, modalSlide]}
    ></Animated.View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
});
