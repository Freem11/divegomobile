import React, { useContext, useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Dimensions, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../styles";
import { SearchStatusContext } from "../contexts/searchStatusContext";

import * as S from "./styles";
import useSearchTool from "./useSearchtool";
import SearchToolInput from "./searchToolInput";
import SearchToolList from "./searchToolList";

const { height } = Dimensions.get("window");
const INPUT_TOP_MARGIN = moderateScale(0);
const INPUT_BAR_HEIGHT = moderateScale(50);
const LIST_VISUAL_START_Y = INPUT_TOP_MARGIN + INPUT_BAR_HEIGHT ;

export default function SearchTool() {
  const {
    list,
    searchValue,
    handleChange,
    handleClear,
    handleMapOptionSelected,
    handleDiveSiteOptionSelected,
    handleSeaLifeOptionSelected,
    handleFocus,
    handleCancelSearch
  } = useSearchTool();

  const { setSearchStatus } = useContext(
    SearchStatusContext
  );

  const insets = useSafeAreaInsets();

  const shouldBeVisible = list.length > 0;

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
    <TouchableWithoutFeedback onPress={handleCancelSearch}>
      <View style={{ flex: 1 }}>
        <S.PositioningWrapper>
          <SearchToolInput
            iconLeft="navigation-variant-outline"
            iconRight="close"
            searchValue={searchValue}
            handleChange={handleChange}
            handleClear={handleClear}
            handleFocus={handleFocus}
          />
        </S.PositioningWrapper>

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
            handleSeaLifeOptionSelected={handleSeaLifeOptionSelected}
            setSearchStatus={setSearchStatus}
          />
        </Animated.View>

      </View>
    </TouchableWithoutFeedback>
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