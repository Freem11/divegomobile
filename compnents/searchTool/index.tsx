import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Dimensions } from "react-native";
import useSearchTool from "./useSearchtool";
import SearchToolInput from "./searchToolInput";
import SearchToolList from "./searchToolList";
import { colors } from "../styles";

const { height } = Dimensions.get("window");
const INPUT_TOP_MARGIN = 60;
const INPUT_BAR_HEIGHT = 50;
const LIST_VISUAL_START_Y = INPUT_TOP_MARGIN + INPUT_BAR_HEIGHT ;

export default function SearchTool() {
  const {
    list,
    searchValue,
    handleChange,
    handleClear,
    handleMapOptionSelected,
    handleDiveSiteOptionSelected,
  } = useSearchTool();

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
      outputRange: ['rgba(255, 255, 255, 0)', colors.themeWhite], 
    }),
    opacity: anim,
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
      <View style={{ marginTop: INPUT_TOP_MARGIN, alignSelf: "center", zIndex: 20 }}>
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
    // 'top' is now fixed, 'height' and 'opacity' are animated by `listContentAnimatedStyle`
    overflow: 'hidden', // Essential: Clips content that extends beyond the animated height
  },
});