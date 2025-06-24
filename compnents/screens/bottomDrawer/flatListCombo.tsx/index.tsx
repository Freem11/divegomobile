import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FlatList as GHFlatList, NativeViewGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import SeaLifeList from "./seaLife/seaLifeList";
import DiveSiteList from "./diveSites/diveSiteList";
import DiveCenterList from "./diveCenters/diveCenterList";
import Button from '../../../reusables/button';
import * as S from "../styles";

const { width, height } = Dimensions.get('window');

const outerData = [0, 1, 2]; // 0 = SeaLife, 1 = Page2, 2 = Page3

export default function HorizontalPager({isDrawerOpen, animatedButtonStyle, closeDrawer}) {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
