// HorizontalPager.tsx

import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import { FlatList as GHFlatList, NativeViewGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import SeaLifeList from "./seaLifeList";

const { width, height } = Dimensions.get('window');

const outerData = [0, 1, 2]; // 0 = SeaLife, 1 = Page2, 2 = Page3

export default function HorizontalPager() {
  const horizontalGestureRef = useRef(null);

  const renderPage = ({ item }) => {
    return (
      <View style={{ width, height }}>
        {item === 0 && (
          <SeaLifeList horizontalGestureRef={horizontalGestureRef} />
        )}
        {item === 1 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Your second vertical list here */}
          </View>
        )}
        {item === 2 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Your third vertical list here */}
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeViewGestureHandler ref={horizontalGestureRef}>
        <GHFlatList
          data={outerData}
          keyExtractor={(item) => `page-${item}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderPage}
        />
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
}
