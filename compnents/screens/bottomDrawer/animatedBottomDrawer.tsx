import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import {
  activeFonts,
  colors,
  fontSizes,
  buttonSizes,
} from '../../styles';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DRAWER_CLOSED = moderateScale(30)
const DRAWER_OPEN = windowHeight

export default function BottomDrawer(props) {
  const {
    dataSet,
    emptyDrawer,
  } = props;

  const photosRef = useRef(null);
  const boxheight = useSharedValue(DRAWER_CLOSED);
  const buttonWidth = useSharedValue(moderateScale(buttonSizes.small.width));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const bounds = {
    lower: DRAWER_CLOSED, 
    upper: DRAWER_OPEN 
  }

  const toggleDrawerState = useCallback((currentDrawerState) => {
    if(!currentDrawerState){
      setTimeout(() => { 
        setIsDrawerOpen(prev => !prev);
      }, 200);
    } else {
      setIsDrawerOpen(prev => !prev);
    }
  }, []);

  const buttonOpen = moderateScale(buttonSizes.medium.width)
  const buttonClosed = moderateScale(buttonSizes.small.width)

  const startHeight = useSharedValue(DRAWER_CLOSED);

  const animatedBottomDrawer = Gesture.Pan()
  .onBegin(() => {
    startHeight.value = boxheight.value;
  })
  .onUpdate((event) => {
    const newHeight = startHeight.value - event.translationY;

    // Clamp within bounds (between closed and full screen)
    boxheight.value = Math.min(Math.max(bounds.lower, newHeight), bounds.upper);

    // Optional: animate button width with drawer progress
    const progress = (boxheight.value - bounds.lower) / (bounds.upper - bounds.lower);
    buttonWidth.value = buttonClosed + (buttonOpen - buttonClosed) * progress;
  })
  .onEnd((event) => {
    const isFastUpward = event.velocityY < -10;
    const isFastDownward = event.velocityY > 10;
    const isDrawerMoreOpen = boxheight.value > windowHeight * 0.4;

    const shouldOpen = isFastUpward || isDrawerMoreOpen && !isFastDownward;

    const finalHeight = shouldOpen ? bounds.upper : bounds.lower;
    const finalButtonWidth = shouldOpen ? buttonOpen : buttonClosed;

    boxheight.value = withTiming(finalHeight, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    buttonWidth.value = withTiming(finalButtonWidth, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });

    runOnJS(setIsDrawerOpen)(shouldOpen);
  });

  const colorProgress = useSharedValue(0);

useEffect(() => {
  if (isDrawerOpen) {
    colorProgress.value = withTiming(1, { duration: 1500 });
  } else {
    colorProgress.value = withTiming(0, { duration: 750 });
  }
}, [isDrawerOpen]);

  
  const animatedBoxStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [colors.primaryBlue, colors.themeWhite]
    );
  
    return {
      height: withTiming(boxheight.value, {
        duration: 400,
        easing: Easing.inOut(Easing.linear),
      }),
      backgroundColor: bgColor,    
      borderTopColor: bgColor,
      borderColor: bgColor,
      borderBottomColor: bgColor,
    };
  });

  return (
    <GestureDetector gesture={animatedBottomDrawer}>
      <Animated.View style={[styles.mainHousing, animatedBoxStyle]}>
        
        <View style={styles.handle}>
          <View style={{
            width: moderateScale(40),
            height: moderateScale(5),
            backgroundColor: '#ccc',
            borderRadius: 3,
          }} />
        </View>
  
        {dataSet && dataSet.length > 0 ? (
          <FlatList
            style={styles.page}
            contentContainerStyle={styles.pageContainer}
            ListFooterComponent={<View style={{ height: moderateScale(60) }} />}
            ref={photosRef}
            pagingEnabled
            horizontal={false}
            showsVerticalScrollIndicator={false}
            snapToInterval={moderateScale(290)}
            snapToAlignment="center"
            decelerationRate="normal"
            keyExtractor={(item) => `${item.id}-${item.dateTaken}`}
            data={dataSet}
            renderItem={({ item, index }) => (
              <View>
                {/* Your actual item content here */}
              </View>
            )}
          />
        ) : (
          <View style={{ alignItems: "center", width: windowWidth }}>
            <Text style={styles.noSightings}>{emptyDrawer}</Text>
          </View>
        )}
  
      </Animated.View>
    </GestureDetector>
  );
  
}

const styles = StyleSheet.create({
  mainHousing: {
    position: "relative",
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 3,
    elevation: 10,
    width: windowWidth,
    // borderTopColor: colors.primaryBlue,
    // borderColor: colors.primaryBlue,
    // borderBottomColor: colors.primaryBlue,
    borderWidth: moderateScale(1),
    borderTopRightRadius: moderateScale(25),
    borderTopLeftRadius: moderateScale(25),
  },
  page: {
    width: windowWidth,
  },
  handle: {
    zIndex: 11,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "darkgrey",
    // borderBottomWidth: moderateScale(1),
    height: moderateScale(30),
    width: "100%",
  },
  flatListHeader: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(60),
  },
  label: {
    color: colors.themeBlack,
    fontFamily: activeFonts.Regular,
    fontSize: moderateScale(fontSizes.SmallText),
  },
  locationHeader: {
    flexDirection: "row",
    height: moderateScale(50),
    width: windowWidth,
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: moderateScale(2),
    borderBottomColor: "darkgrey",
    borderTopWidth: moderateScale(2),
    borderTopColor: "darkgrey",
    marginTop: "5%",
    marginBottom: "2%",
    // backgroundColor: "lightgray",
  },
  headerText: {
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Medium,
  },
  noSightings: {
    marginTop: windowWidth > 600 ? "15%" : "25%",
    flexWrap: 'wrap',
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: "5%",
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(fontSizes.StandardText),
    color: colors.themeBlack,
  },
});
