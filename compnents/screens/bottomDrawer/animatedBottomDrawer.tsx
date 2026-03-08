import React, { useEffect, useContext, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  interpolateColor,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";

import { colors, buttonSizes } from "../../styles";
import { SearchStatusContext } from "../../contexts/searchStatusContext";
import { region } from "../../../entities/region";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DRAWER_DEFAULT_CLOSED = moderateScale(30);
const DRAWER_PARTIAL = moderateScale(120);
const DRAWER_DEFAULT_OPEN = windowHeight;

const DRAWER_SEARCH_OPEN = windowHeight * 0.4;

interface PagerProps {
  shouldShowButton: boolean;
  animatedButtonStyle: any;
  animatedStatsStyle: any;
  closeDrawer: () => void;
}

type BottomDrawerProps = {
  mapRegion: region;
  mapConfig: number;
  Content: (props: PagerProps) => React.ReactElement;
  onProgress?: (progress: number) => void;
};

export default function BottomDrawer({ mapRegion, mapConfig, Content, onProgress }: BottomDrawerProps) {
  const { searchStatus, setSearchStatus } = useContext(SearchStatusContext);

  let DRAWER_OPEN: number;
  let DRAWER_CLOSED: number;
  let DRAWER_START: number;

  // Logic for DiveSiteSearch (config 4)
  if (mapConfig === 4) {
    DRAWER_OPEN = DRAWER_SEARCH_OPEN;
    DRAWER_CLOSED = DRAWER_SEARCH_OPEN; // Locked at the same height
    DRAWER_START = DRAWER_SEARCH_OPEN;
  } else if (mapConfig === 0) {
    DRAWER_OPEN = DRAWER_DEFAULT_OPEN;
    DRAWER_CLOSED = DRAWER_DEFAULT_CLOSED;
    DRAWER_START = DRAWER_DEFAULT_OPEN;
  } else {
    DRAWER_OPEN = DRAWER_DEFAULT_OPEN;
    DRAWER_CLOSED = DRAWER_DEFAULT_CLOSED;
    DRAWER_START = DRAWER_DEFAULT_OPEN;
  }

  const boxheight = useSharedValue(DRAWER_START);
  const buttonOpacity = useSharedValue(1);
  const startHeight = useSharedValue(DRAWER_START);

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // --- BRIDGE TO MAP ---
  useAnimatedReaction(
    () => {
      // If config 4, progress is always 1 (fully "pushed")
      if (mapConfig === 4) return 1;

      return interpolate(
        boxheight.value,
        [DRAWER_PARTIAL, DRAWER_OPEN],
        [0, 1],
        Extrapolation.CLAMP
      );
    },
    (progress) => {
      if (onProgress) {
        runOnJS(onProgress)(progress);
      }
    }
  );

  useEffect(() => {
    if (searchStatus && boxheight.value === DRAWER_OPEN && mapConfig !== 4) {
      boxheight.value = DRAWER_PARTIAL;
    }
    setSearchStatus(false);
  }, [searchStatus]);

  useEffect(() => {
    buttonOpacity.value = withTiming(isDrawerOpen ? 1 : 0, { duration: 300 });
  }, [isDrawerOpen]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(boxheight.value, [DRAWER_PARTIAL, DRAWER_OPEN], [0, 1], Extrapolation.CLAMP);
    const finalOpacity = interpolatedOpacity * buttonOpacity.value;
    return { opacity: finalOpacity, display: finalOpacity > 0.01 ? "flex" : "none" };
  });

  const animatedStatsStyle = useAnimatedStyle(() => {
    const interpolatedOpacity = interpolate(boxheight.value, [DRAWER_PARTIAL - 1, DRAWER_PARTIAL, DRAWER_OPEN], [1, 1, 0], Extrapolation.CLAMP);
    return { opacity: interpolatedOpacity, display: interpolatedOpacity > 0.01 ? "flex" : "none" };
  });

  const closeDrawer = () => {
    if (mapConfig === 4) return; // Prevent closing if in config 4
    boxheight.value = withTiming(DRAWER_CLOSED, { duration: 1000, easing: Easing.out(Easing.cubic) }, (f) => { if (f) runOnJS(setIsDrawerOpen)(false); });
  };

  const animatedBottomDrawer = Gesture.Pan()
    .enabled(mapConfig !== 4) // DISBALED FOR CONFIG 4
    .minDistance(10)
    .onBegin(() => {
      startHeight.value = boxheight.value;
    })
    .onUpdate((event) => {
      const newHeight = startHeight.value - event.translationY;
      boxheight.value = Math.min(Math.max(DRAWER_CLOSED, newHeight), DRAWER_OPEN);
    })
    .onEnd((event) => {
      const current = boxheight.value;
      const velocity = event.velocityY;
      let target;

      if (velocity < -50) target = current <= DRAWER_CLOSED + 30 ? DRAWER_PARTIAL : DRAWER_OPEN;
      else if (velocity > 50) target = current >= DRAWER_OPEN - 100 ? DRAWER_PARTIAL : DRAWER_CLOSED;
      else {
        const distances = [DRAWER_CLOSED, DRAWER_PARTIAL, DRAWER_OPEN].map(p => ({ p, d: Math.abs(current - p) }));
        target = distances.sort((a, b) => a.d - b.d)[0].p;
      }

      boxheight.value = withTiming(target, { duration: 500 }, (f) => { if (f) runOnJS(setIsDrawerOpen)(target === DRAWER_OPEN); });
    });

  const animatedBoxStyle = useAnimatedStyle(() => ({
    height: boxheight.value,
    backgroundColor: mapConfig === 0
      ? interpolateColor(boxheight.value, [DRAWER_CLOSED, DRAWER_PARTIAL], [colors.primaryBlue, colors.themeWhite])
      : colors.themeWhite,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={animatedBottomDrawer}>
        <Animated.View style={[styles.mainHousing, animatedBoxStyle]}>
          {/* Hide the handle bar if it can't be moved */}
          <View style={styles.handle}>
            {mapConfig !== 4 && <View style={styles.handleBar} />}
          </View>
          <View style={{ flex: 1, width: "100%" }}>
            {Content({
              shouldShowButton: isDrawerOpen,
              animatedButtonStyle,
              animatedStatsStyle,
              closeDrawer,
            })}
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
    zIndex: 20,
    width: windowWidth,
    borderTopRightRadius: moderateScale(15),
    borderTopLeftRadius: moderateScale(15),
  },
  handle: {
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(30),
    width: "100%",
  },
  handleBar: {
    width: moderateScale(40),
    height: moderateScale(5),
    backgroundColor: "#ccc",
    borderRadius: 3,
  }
});