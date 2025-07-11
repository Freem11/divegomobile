import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Dimensions, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../styles";

import useSearchTool from "./useSearchtool";
import SearchToolInput from "./searchToolInput";
import SearchToolList from "./searchToolList";

const { height } = Dimensions.get("window");
const INPUT_TOP_MARGIN = moderateScale(0);
const INPUT_BAR_HEIGHT = moderateScale(50);
const LIST_VISUAL_START_Y = INPUT_TOP_MARGIN + INPUT_BAR_HEIGHT ;
const windowWidth = Dimensions.get("window").width;

export default function SearchTool() {
  const {
    list,
    searchValue,
    handleChange,
    handleClear,
    handleMapOptionSelected,
    handleDiveSiteOptionSelected,
  } = useSearchTool();

  const insets = useSafeAreaInsets();

  const shouldBeVisible = list.length > 0 || searchValue.length > 0;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: shouldBeVisible ? 1 : 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [shouldBeVisible]);

  const backgroundOverlayAnimatedStyle = {
    backgroundColor: anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(255, 255, 255, 0)", colors.themeWhite], 
    }),
    opacity: anim,
    top: -insets.top,
    height: height + insets.top,
  };

  const listContentAnimatedStyle = {
    top: LIST_VISUAL_START_Y,

    height: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, height - LIST_VISUAL_START_Y],
    }),
    opacity: anim,
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: Platform.OS  === "android" || windowWidth > 700 ? 25 : 0, paddingBottom: 25, alignSelf: "center", zIndex: 20 }}>
        <SearchToolInput
          iconLeft="navigation-variant-outline"
          iconRight="close"
          searchValue={searchValue}
          handleChange={handleChange}
          handleClear={handleClear}
        />
      </View>

      <Animated.View
        pointerEvents={shouldBeVisible ? "auto" : "none"}
        style={[
          StyleSheet.absoluteFillObject,
          backgroundOverlayAnimatedStyle,
          { zIndex: 10 },
        ]}
      />

      <Animated.View
        pointerEvents={shouldBeVisible ? "auto" : "none"}
        style={[
          styles.listWrapper,
          listContentAnimatedStyle,
          { zIndex: 15 },
        ]}
      >

        <SearchToolList
          data={list}
          handleMapOptionSelected={handleMapOptionSelected}
          handleDiveSiteOptionSelected={handleDiveSiteOptionSelected}

        />
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    position: "absolute",
    left: 0,
    width: "100%",
    overflow: "hidden",
  },
});