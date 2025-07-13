import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  interpolateColor,
  withDelay,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import {
  colors,
  buttonSizes,
} from "../../styles";
import HorizontalPager from "./flatListCombo.tsx";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DRAWER_CLOSED = moderateScale(30);
const DRAWER_OPEN = windowHeight;

export default function BottomDrawer() {

  const boxheight = useSharedValue(DRAWER_OPEN);
  const buttonWidth = useSharedValue(moderateScale(buttonSizes.small.width));
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const buttonOpacity = useSharedValue(isDrawerOpen ? 1 : 0);

  useEffect(() => {
    if (isDrawerOpen) {
      buttonOpacity.value = withDelay(
        500,
        withTiming(1, { duration: 300 })
      );
    } else {
      buttonOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isDrawerOpen]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
    };
  });

  const bounds = {
    lower: DRAWER_CLOSED,
    upper: DRAWER_OPEN,
  };

  const closeDrawer = () => {
    boxheight.value = withTiming(DRAWER_CLOSED, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  
    buttonWidth.value = withTiming(buttonClosed, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  
    runOnJS(setIsDrawerOpen)(false);
  };

  const buttonOpen = moderateScale(buttonSizes.medium.width);
  const buttonClosed = moderateScale(buttonSizes.small.width);

  const startHeight = useSharedValue(DRAWER_CLOSED);

  const animatedBottomDrawer = Gesture.Pan()
    .minDistance(10)
    .onBegin(() => {
      startHeight.value = boxheight.value;
    })
    .onUpdate((event) => {
      const newHeight = startHeight.value - event.translationY;
      boxheight.value = Math.min(
        Math.max(bounds.lower, newHeight),
        bounds.upper
      );

      const progress =
        (boxheight.value - bounds.lower) / (bounds.upper - bounds.lower);
      buttonWidth.value =
        buttonClosed + (buttonOpen - buttonClosed) * progress;
    })
    .onEnd((event) => {
      const isFastUpward = event.velocityY < -10;
      const isFastDownward = event.velocityY > 10;
      const isDrawerMoreOpen = boxheight.value > windowHeight * 0.4;

      const shouldOpen = isFastUpward || (isDrawerMoreOpen && !isFastDownward);

      const finalHeight = shouldOpen ? bounds.upper : bounds.lower;
      const finalButtonWidth = shouldOpen ? buttonOpen : buttonClosed;

      boxheight.value = withTiming(finalHeight, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      buttonWidth.value = withTiming(finalButtonWidth, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      runOnJS(setIsDrawerOpen)(shouldOpen);
    })

  const colorProgress = useSharedValue(0);

  useEffect(() => {
    if (isDrawerOpen) {
      colorProgress.value = withTiming(1, { duration: 1500 });
    } else {
      colorProgress.value = withTiming(0, { duration: 750 });
    }
  }, [isDrawerOpen]);

  const animatedBoxStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [colors.primaryBlue, colors.themeWhite]
    );

    return {
      height: withTiming(boxheight.value, {
        duration: 400,
        easing: Easing.inOut(Easing.linear),
      }),
      backgroundColor: bgColor,
      borderTopColor: bgColor,
      borderColor: bgColor,
      borderBottomColor: bgColor,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={animatedBottomDrawer}>
        <Animated.View style={[styles.mainHousing, animatedBoxStyle]}>
          <View style={styles.handle}>
            <View
              style={{
                width: moderateScale(40),
                height: moderateScale(5),
                backgroundColor: "#ccc",
                borderRadius: 3,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <HorizontalPager isDrawerOpen={isDrawerOpen} animatedButtonStyle={animatedButtonStyle} closeDrawer={closeDrawer}/>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainHousing: {
    position: "relative",
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 3,
    elevation: 10,
    width: windowWidth,
    borderWidth: moderateScale(1),
    borderTopRightRadius: moderateScale(25),
    borderTopLeftRadius: moderateScale(25),
  },
  handle: {
    zIndex: 11,
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(30),
    width: "100%",
  },
});