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
  animatedStatsStyle: Record<string, any>
  closeDrawer: () => void
}

export default function HorizontalPager({ shouldShowButton, animatedButtonStyle, animatedStatsStyle, closeDrawer }: HorizontalPagerProps) {
  const flatListRef = useRef(null);
  const boundaries = useMapStore((state) => state.gpsBubble);
  const [diveSites, setDiveSites] = useState(0);
  const [species, setSpecies] = useState(0);
  const [sightings, setSightings] = useState(0);

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

  useEffect(() => {
    if(boundaries){
      let values = {    
        minLat: boundaries.minLat,
        maxLat: boundaries.maxLat,
        minLng: boundaries.minLng,
        maxLng: boundaries.maxLng
      }
      getStats(values)
    }
  },[boundaries])

 const getStats = async (values) => {
  const siteCount = await getMapDiveSiteCount(values)
  setDiveSites(siteCount.label_count)
  const speciesCount = await getMapSpeciesCount(values)
  setSpecies(speciesCount.distinct_label_count)
  const sightingsCount = await getMapSightingCount(values)
  setSightings(sightingsCount.label_count)
 }

  return (
    <GestureHandlerRootView style={{ flex: 1, position: 'relative' }}>

      <Animated.View style={[animatedStatsStyle]}>
        <S.StatContainer>
          <S.Row>
            <S.StatText>{`${diveSites} Dive Sites`}</S.StatText>
            <S.StatText>{`${sightings} Sightings`}</S.StatText>
          </S.Row>
          <S.StatText>{`${species} Species Sighted`}</S.StatText>
        </S.StatContainer>
      </Animated.View>

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