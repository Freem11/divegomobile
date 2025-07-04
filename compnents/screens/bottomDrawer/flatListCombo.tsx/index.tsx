import React, { useRef } from 'react';
import { Dimensions, TouchableOpacity, View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatList as GHFlatList, NativeViewGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import SeaLifeList from "./seaLife/seaLifeList";
import DiveSiteList from "./diveSites/diveSiteList";
import DiveCenterList from "./diveCenters/diveCenterList";
import Button from '../../../reusables/button';
import * as S from "../styles";
import ButtonIcon from "../../../reusables/buttonIcon";
import { colors } from "../../../styles";
import { useMapStore } from "../../../googleMap/useMapStore";
import { GPSBubble } from "../../../../entities/GPSBubble";
import { BoundingBox, LatLng } from "react-native-maps";

const { width, height } = Dimensions.get('window');

const outerData = [0, 1, 2]; // 0 = SeaLife, 1 = Page2, 2 = Page3
const DOUBLE_TAP_DELAY = 300;

export default function HorizontalPager({isDrawerOpen, animatedButtonStyle, closeDrawer}) {
  const gpsBubble = useMapStore((state) => state.gpsBubble);
  const setGpsBubble = useMapStore((state) => state.actions.setGpsBubble);
  const mapRef = useMapStore((state) => state.mapRef);

  const lastTap = useRef<number | null>(null);
  const singleTapTimeout = useRef<NodeJS.Timeout | null>(null);

  const horizontalGestureRef = useRef(null);
  const flatListRef = useRef(null);

  const renderPage = ({ item }) => {
    return (
      <View style={{ width, height }}>
        {item === 0 && (
          <SeaLifeList horizontalGestureRef={horizontalGestureRef} />
        )}
        {item === 1 && (
          <DiveSiteList horizontalGestureRef={horizontalGestureRef} />
        )}
        {item === 2 && (
          <DiveCenterList horizontalGestureRef={horizontalGestureRef} />
        )}
      </View>
    );
  };

  React.useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }, 0);
  }, []);

  const handleTap = async () => {
    const now = Date.now();

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {

      if (singleTapTimeout.current) {
        clearTimeout(singleTapTimeout.current);
      }
      const boundaries = await mapRef.getMapBoundaries();
      const newBounds = handleZoom(boundaries, 0.4);
      const region = boundsToRegion(newBounds);
      mapRef.animateToRegion(region, 300);
      lastTap.current = null;
    } else {

      lastTap.current = now;
      singleTapTimeout.current = setTimeout(async () => {
        const boundaries = await mapRef.getMapBoundaries();
        const newBounds = handleZoom(boundaries, 2.5)
        const region = boundsToRegion(newBounds)
        mapRef.animateToRegion(region, 300);
        lastTap.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  };

  function handleZoom(bounds: BoundingBox, zoomFactor: number) {
    const { northEast, southWest } = bounds;
  
    const latSpan = northEast.latitude - southWest.latitude;
    const lngSpan = northEast.longitude - southWest.longitude;
  
    const latExpansion = (latSpan * zoomFactor - latSpan) / 2;
    const lngExpansion = (lngSpan * zoomFactor - lngSpan) / 2;
  
    return {
      minLat: southWest.latitude - latExpansion,
      maxLat: northEast.latitude + latExpansion,
      minLng: southWest.longitude - lngExpansion,
      maxLng: northEast.longitude  + lngExpansion,
    };
  }
  
  type boundaries ={
    minLat: number,
    maxLat: number,
    minLng: number, 
    maxLng: number
  }
  
  function boundsToRegion(bounds: boundaries) {
    const { minLat, maxLat, minLng, maxLng } = bounds;
  
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: maxLat - minLat,
      longitudeDelta: maxLng - minLng,
    };
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View
        style={[animatedButtonStyle, { zIndex: 99 }]}
        pointerEvents={isDrawerOpen ? 'auto' : 'none'}
      >
        <S.IconBox>
          <ButtonIcon 
            icon="plus-minus-variant"
            onPress={() => handleTap()}
            size='headerIcon'
            fillColor={colors.neutralGrey}
          />
        </S.IconBox> 
      </Animated.View> 

      <NativeViewGestureHandler ref={horizontalGestureRef} >
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
      </NativeViewGestureHandler>
      <Animated.View
        style={[animatedButtonStyle]}
        pointerEvents={isDrawerOpen ? 'auto' : 'none'}
      >
        <S.ButtonBox>
          <Button 
            onPress={() => closeDrawer()}
            alt={false} 
            size='medium'
            title={'Map'} 
            iconRight="chevron-right"
          />
        </S.ButtonBox>
      </Animated.View>     
    </GestureHandlerRootView>
  );
}
