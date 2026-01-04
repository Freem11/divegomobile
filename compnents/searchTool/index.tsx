import React, { useContext, useEffect, useRef } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../styles";
import { SearchStatusContext } from "../contexts/searchStatusContext";

import useSearchTool from "./useSearchtool";
import SearchToolInput from "./searchToolInput";
import SearchToolList from "./searchToolList";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

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
    handleCancelSearch,
  } = useSearchTool();

  const { setSearchStatus } = useContext(SearchStatusContext);
  const insets = useSafeAreaInsets();

  const isActive = list && list.length > 0;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  // UNIFIED TOP POSITION
  const TOP_POSITION = Platform.select({
    ios: insets.top + moderateScale(5),
    android: (StatusBar.currentHeight || 0) + moderateScale(10),
  });

  return (
    <View style={styles.masterAnchor} pointerEvents="box-none">

      {/* LAYER 1: FULL SCREEN OVERLAY */}
      <Animated.View
        pointerEvents={isActive ? "auto" : "none"}
        style={[
          styles.fullScreenWhite,
          {
            opacity: anim,
            top: 0,
            left: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={handleCancelSearch}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* LAYER 2: THE RESULTS LIST */}
      <Animated.View
        pointerEvents={isActive ? "auto" : "none"}
        style={[
          styles.listContainer,
          {
            top: TOP_POSITION + moderateScale(55),
            opacity: anim,
          },
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

      {/* LAYER 3: THE CENTERED INPUT BAR */}
      <View
        style={[styles.inputAbsolute, { top: TOP_POSITION }]}
        pointerEvents="box-none"
      >
        <View style={styles.inputWidthLimit}>
          <SearchToolInput
            iconLeft="navigation-variant-outline"
            iconRight="close"
            searchValue={searchValue}
            handleChange={handleChange}
            handleClear={handleClear}
            handleFocus={handleFocus}
          />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  masterAnchor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.01)",
  },
  fullScreenWhite: {
    position: "absolute",
    backgroundColor: colors.themeWhite,
    zIndex: 10,
  },
  inputAbsolute: {
    position: "absolute",
    width: SCREEN_WIDTH,
    alignSelf: "center",
    zIndex: 100,
  },
  inputWidthLimit: {
    width: "90%", // The search bar width
  },
  listContainer: {
    position: "absolute",
    width: SCREEN_WIDTH,
    bottom: 0,
    zIndex: 50,
    backgroundColor: "transparent",
  },
});