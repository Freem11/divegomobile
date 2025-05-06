import { Dimensions } from "react-native";
import {
  Easing,
  runOnJS,
  withDecay,
  withTiming,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import { useEffect } from "react";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
const HALF_HEIGHT = SCREEN_HEIGHT / 2;
const TOP_SECTION_HEIGHT = moderateScale(70);
const DECELERATION = 0.985;

export const useParallaxDrawer = (onClose: () => void, onMapFlip?: () => void) => {
  const translateY = useSharedValue(HALF_HEIGHT);
  const contentHeight = useSharedValue(0);
  const startY = useSharedValue(0);
  const savedTranslateY = useSharedValue(HALF_HEIGHT);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const minY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT;
      const maxY = HALF_HEIGHT;
      const nextY = startY.value + event.translationY;
      translateY.value = Math.min(maxY, Math.max(minY, nextY));
    })
    .onEnd((event) => {
      const minY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT;
      const maxY = HALF_HEIGHT;

      if (event.velocityY < 0) {
        translateY.value = withDecay({
          velocity: event.velocityY,
          clamp: [minY, maxY],
          deceleration: DECELERATION,
        });
      } else {
        translateY.value = withDecay(
          { velocity: event.velocityY, deceleration: DECELERATION },
          () => {
            if (translateY.value > HALF_HEIGHT) {
              translateY.value = withTiming(HALF_HEIGHT, {
                duration: 1600, // 1.6 seconds
                easing: Easing.out(Easing.exp),
              });
            }
          }
        );
      }
    });

  const animatedDrawerStyle = useAnimatedStyle(() => ({
    height: contentHeight.value + TOP_SECTION_HEIGHT,
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateY.value,
      [0, HALF_HEIGHT, SCREEN_HEIGHT],
      [1, 1.25, 3.25]
    );
    return { transform: [{ scale }] };
  });

  const animatedSafeAreaStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [HALF_HEIGHT, 0],
      [0, 0.35],
      "clamp"
    );
    return {
      backgroundColor: `rgba(128, 128, 128, ${opacity})`,
    };
  });


  const closeParallax = (mapConfig: number | null) => {
    savedTranslateY.value = translateY.value;
    translateY.value = withTiming(0, { duration: 1 }, (finished) => {
      if (finished) {
        translateY.value = 0;
        startY.value = 0;
        if (mapConfig === 3) {
          runOnJS(onMapFlip)();
        } else {
          runOnJS(onClose)();
        }
      }
    });
  };
  
  const restoreParallax = () => {
    translateY.value = withTiming(savedTranslateY.value, {
      duration: 300,
      easing: Easing.out(Easing.exp),
    });
  };

  
  return {
    SCREEN_WIDTH,
    panGesture,
    animatedDrawerStyle,
    animatedBackgroundStyle,
    animatedSafeAreaStyle,
    contentHeight,
    closeParallax,
    restoreParallax
  };
};
