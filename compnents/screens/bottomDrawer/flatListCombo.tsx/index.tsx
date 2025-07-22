import React, { useEffect, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated from "react-native-reanimated";
import { FlatList as GHFlatList, GestureHandlerRootView } from "react-native-gesture-handler";

import Button from "../../../reusables/button";
import * as S from "../styles";

import DiveCenterList from "./diveCenters/diveCenterList";
import DiveSiteList from "./diveSites/diveSiteList";
import SeaLifeList from "./seaLife/seaLifeList";
import { getMapDiveSiteCount } from "../../../../supabaseCalls/diveSiteSupabaseCalls";
import { getMapSightingCount, getMapSpeciesCount } from "../../../../supabaseCalls/photoSupabaseCalls";
import { useMapStore } from "../../../googleMap/useMapStore";

const { width, height } = Dimensions.get("window");

const outerData = [0, 1, 2]; // 0 = SeaLife, 1 = Page2, 2 = Page3
const DOUBLE_TAP_DELAY = 300;

interface HorizontalPagerProps {
  shouldShowButton: boolean
  animatedButtonStyle: Record<string, any>
  closeDrawer: () => void
}

export default function HorizontalPager({ shouldShowButton, animatedButtonStyle, closeDrawer }: HorizontalPagerProps) {
  const flatListRef = useRef(null);

  const renderPage = ({ item }) => {
    return (
      <View style={{ width, height }}>
        {item === 0 && (
          <SeaLifeList />
        )}
        {item === 1 && (
          <DiveSiteList />
        )}
        {item === 2 && (
          <DiveCenterList />
        )}
      </View>
    );
  };

  React.useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }, 0);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>
      <GHFlatList
        ref={flatListRef}
        data={outerData}
        keyExtractor={(item) => `page-${item}`}
        horizontal
        pagingEnabled
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderPage}
        getItemLayout={(data, index) => (
          { length: width, offset: width * index, index }
        )}
      />

      <Animated.View
        style={[animatedButtonStyle]}
        pointerEvents={shouldShowButton ? "auto" : "none"}
      >
        <S.ButtonBox>
          <Button
            onPress={() => closeDrawer()}
            alt={false}
            size="medium"
            title={"Map"}
            iconRight="chevron-right"
          />
        </S.ButtonBox>
      </Animated.View>
    </GestureHandlerRootView>
  );
}