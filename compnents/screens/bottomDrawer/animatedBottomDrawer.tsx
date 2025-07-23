import React, { useEffect, useContext, useState } from "react";
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
  interpolate,
  Extrapolation,
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
import * as S from "./styles";
import HorizontalPager from "./flatListCombo.tsx";
import { SearchStatusContext } from "../../contexts/searchStatusContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DRAWER_CLOSED = moderateScale(30);
const DRAWER_PARTIAL = moderateScale(120);
const DRAWER_OPEN = windowHeight;

export default function BottomDrawer() {
  const { searchStatus, setSearchStatus } = useContext(SearchStatusContext);

  const boxheight = useSharedValue(DRAWER_OPEN);
  const buttonWidth = useSharedValue(moderateScale(buttonSizes.small.width));
  const buttonOpacity = useSharedValue(1);
  const buttonActiveProgress = useSharedValue(1);

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  useEffect(() => {
    if (searchStatus && boxheight.value === DRAWER_OPEN) {
      boxheight.value = DRAWER_PARTIAL;
    }
    setSearchStatus(false);
  }, [searchStatus]);

  useEffect(() => {
    if (isDrawerOpen) {
      buttonOpacity.value = withTiming(1, { duration: 300 });
    } else {
      buttonOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isDrawerOpen]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      boxheight.value,
      [DRAWER_PARTIAL, DRAWER_OPEN],
      [0, 1],
      Extrapolation.CLAMP
    );

    const finalOpacity = interpolatedOpacity * buttonOpacity.value;
    const displayStyle = finalOpacity > 0.01 ? "flex" : "none";

    return {
      opacity: finalOpacity,
      display: displayStyle,
    };
  });

  const animatedStatsStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(
      boxheight.value,
      [DRAWER_PARTIAL - 1, DRAWER_PARTIAL, DRAWER_OPEN],
      [1, 1, 0],
      Extrapolation.CLAMP
    );
  
    const finalOpacity = interpolatedOpacity;
    const displayStyle = finalOpacity > 0.01 ? "flex" : "none";
  
    return {
      opacity: finalOpacity,
      display: displayStyle,
    };
  });
  
  

  const bounds = {
    lower: DRAWER_CLOSED,
    upper: DRAWER_OPEN,
  };

  const buttonOpen = moderateScale(buttonSizes.medium.width);
  const buttonClosed = moderateScale(buttonSizes.small.width);

  const closeDrawer = () => {
    boxheight.value = withTiming(DRAWER_CLOSED, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    }, (finished) => {
      if (finished) {
        runOnJS(setIsDrawerOpen)(false);
      }
    });

    buttonWidth.value = withTiming(buttonClosed, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    buttonOpacity.value = withTiming(0, { duration: 200 });
  };

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

      buttonActiveProgress.value = interpolate(
        boxheight.value,
        [DRAWER_PARTIAL, DRAWER_OPEN],
        [0, 1],
        Extrapolation.CLAMP
      );
    })
    .onEnd((event) => {
      const current = boxheight.value;
      const velocity = event.velocityY;
      let target;

      if (velocity < -50) {
        // Swiping Up
        if (current <= DRAWER_CLOSED + 30) {
          target = DRAWER_PARTIAL;
        } else {
          target = DRAWER_OPEN;
        }
      } else if (velocity > 50) {
        // Swiping Down
        if (current >= DRAWER_OPEN - 100) {
          target = DRAWER_PARTIAL;
        } else {
          target = DRAWER_CLOSED;
        }
      } else {
        // Snap to nearest
        const distances = [
          { pos: DRAWER_CLOSED, dist: Math.abs(current - DRAWER_CLOSED) },
          { pos: DRAWER_PARTIAL, dist: Math.abs(current - DRAWER_PARTIAL) },
          { pos: DRAWER_OPEN, dist: Math.abs(current - DRAWER_OPEN) },
        ];
        distances.sort((a, b) => a.dist - b.dist);
        target = distances[0].pos;
      }

      const isOpen = target === DRAWER_OPEN;

      boxheight.value = withTiming(target, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      }, (finished) => {
        if (finished) {
          runOnJS(setIsDrawerOpen)(isOpen);
        }
      });

      buttonWidth.value = withTiming(
        target === DRAWER_OPEN ? buttonOpen : buttonClosed,
        { duration: 300, easing: Easing.out(Easing.cubic) }
      );

      buttonOpacity.value = withTiming(
        target === DRAWER_OPEN ? 1 : 0,
        { duration: 300 }
      );
    });

  const animatedBoxStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      boxheight.value,
      [DRAWER_CLOSED, DRAWER_PARTIAL],
      [colors.primaryBlue, colors.themeWhite]
    );

    return {
      height: boxheight.value,
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

          <View style={{ flex: 1, width: "100%" }}>
            <HorizontalPager
              shouldShowButton={isDrawerOpen}
              animatedButtonStyle={animatedButtonStyle}
              animatedStatsStyle={animatedStatsStyle}
              closeDrawer={closeDrawer}
            />
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
    overflow: "visible",
  },
  handle: {
    zIndex: 11,
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(30),
    width: "100%",
  },
});
