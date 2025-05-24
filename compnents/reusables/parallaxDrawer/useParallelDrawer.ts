import { Dimensions } from "react-native";
import {
  Easing,
  runOnJS,
  withDecay,
  withTiming,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import { useContext, useEffect } from "react";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
const HALF_HEIGHT = SCREEN_HEIGHT / 2;
const TOP_SECTION_HEIGHT = moderateScale(70);
const DECELERATION = 0.985;

export const useParallaxDrawer = (onClose: () => void, onMapFlip?: () => void) => {
  const translateY = useSharedValue(HALF_HEIGHT);
  const contentHeight = useSharedValue(0);
  const startY = useSharedValue(0);
  const savedTranslateY = useSharedValue(HALF_HEIGHT);

  const { levelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);
  const { fullScreenModal } = useContext(FullScreenModalContext);
  
  useEffect(() => {
    if (fullScreenModal && savedTranslateY.value === HALF_HEIGHT) {
      translateY.value = HALF_HEIGHT;
      startY.value = 0;
    }
  }, [fullScreenModal]);

  useEffect(() => {
    if (levelOneScreen && savedTranslateY.value === HALF_HEIGHT) {
      translateY.value = HALF_HEIGHT;
      startY.value = 0;
    }
  }, [levelOneScreen]);

  useEffect(() => {
    if (levelTwoScreen && savedTranslateY.value === HALF_HEIGHT) {
      translateY.value = HALF_HEIGHT;
      startY.value = 0;
    }
  }, [levelTwoScreen]);

  useAnimatedReaction(
    () => contentHeight.value,
    (newHeight, prevHeight) => {
      if (newHeight !== prevHeight && newHeight > 0) {
        const minY = SCREEN_HEIGHT - newHeight - TOP_SECTION_HEIGHT;
        const desiredY = Math.max(minY, HALF_HEIGHT);
  
        if (translateY.value < minY) {
          translateY.value = withTiming(minY, { duration: 300 });
        }
  
        if (translateY.value > desiredY || translateY.value === 0) {
          translateY.value = withTiming(desiredY, { duration: 300 });
        }
      }
    }
  );

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
                duration: 1600,
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
    translateY.value = withTiming(0, { duration: 100 }, (finished) => {
      if (finished) {
        translateY.value = 0;
        startY.value = 0;
        if (mapConfig === 1) {
          runOnJS(onMapFlip)();
        } else {
          savedTranslateY.value = HALF_HEIGHT;
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
    restoreParallax,
  };
};
