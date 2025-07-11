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
import { useContext, useEffect, useState } from "react";

import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { EditsContext } from "../../contexts/editsContext";
import { SavedTranslateYContext } from "../../contexts/savedTranslateYContext";
import { ActiveSceen, useActiveScreenStore } from "../../../store/useActiveScreenStore";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
const HALF_HEIGHT = SCREEN_HEIGHT / 2;
const TOP_SECTION_HEIGHT = moderateScale(70);
const DECELERATION = 0.985;

export const useParallaxDrawer = (onClose: () => void, onMapFlip?: () => void) => {
  const translateY = useSharedValue(HALF_HEIGHT);
  const contentHeight = useSharedValue(0);
  const startY = useSharedValue(0);
  const [bottomHitCount, setBottomHitCount] = useState(1);
  const hasHitBottom = useSharedValue(false);

  const { levelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const activeScreen = useActiveScreenStore((state) => state.activeScreen);

  const { editInfo, setEditInfo } = useContext(EditsContext);

  const { savedTranslateY, setSavedTranslateY } = useContext(SavedTranslateYContext);

  useEffect(() => {
    if (levelOneScreen && savedTranslateY === HALF_HEIGHT) {
      translateY.value = HALF_HEIGHT;
      startY.value = HALF_HEIGHT;
    }
  }, [levelOneScreen]);

  useEffect(() => {
    if (levelTwoScreen && savedTranslateY === HALF_HEIGHT) {
      translateY.value = HALF_HEIGHT;
      startY.value = HALF_HEIGHT;
    }
  }, [levelTwoScreen]);


  const bottomHitCountRef = useSharedValue(bottomHitCount);

  useEffect(() => {
    bottomHitCountRef.value = bottomHitCount;
  }, [bottomHitCount]);


  const MIN_SHRINK = moderateScale(150); 
  const lastAdjustedHeightRef = useSharedValue(Number.MAX_VALUE);

  useAnimatedReaction(
    () => ({
      height: contentHeight.value,
      currentY: translateY.value,
    }),
    (newValue, prevValue) => {
      if (!prevValue) return;

      const { height: newHeight, currentY } = newValue;
      const { height: prevHeight } = prevValue;

      const shrinkAmount = prevHeight - newHeight;
      const contentShrankSignificantly = shrinkAmount > MIN_SHRINK;

      if(contentShrankSignificantly){
        lastAdjustedHeightRef.value = newHeight;

        const minTranslateY = Math.min(
          SCREEN_HEIGHT - newHeight - TOP_SECTION_HEIGHT,
          HALF_HEIGHT
        );
  
        if (currentY < minTranslateY) {
          translateY.value = withTiming(minTranslateY, { duration: 300 });
        } 
      }

    }
  );

  const handleDrawerHitBottom = () => {
    setBottomHitCount(prev => prev + 1);

    setTimeout(() => {
      hasHitBottom.value = false;
    }, 1000);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const rawMinY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT;
      const isShortContent = contentHeight.value + TOP_SECTION_HEIGHT < HALF_HEIGHT;
      const minY = isShortContent ? HALF_HEIGHT : rawMinY;
      const maxY = HALF_HEIGHT;
    
      const nextY = startY.value + event.translationY;
      translateY.value = Math.min(maxY, Math.max(minY, nextY));
    
      const isAtBottom = Math.abs(translateY.value - minY) < 2000;
      if (isAtBottom && !hasHitBottom.value) {
        hasHitBottom.value = true;
        runOnJS(handleDrawerHitBottom)();
      }
    })
    .onEnd((event) => {
      const rawMinY = SCREEN_HEIGHT - contentHeight.value - TOP_SECTION_HEIGHT;
      const isShortContent = contentHeight.value + TOP_SECTION_HEIGHT < HALF_HEIGHT;
      const minY = isShortContent ? HALF_HEIGHT : rawMinY;
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

  const updateActiveScreen = (
    latestScreen: ActiveSceen | null,
    currentScreen: ActiveSceen | null,
    setActiveScreenFn: (screenName: string, params?: {}) => void
  ) => {
    const isSame =
      latestScreen &&
      currentScreen &&
      latestScreen.screenName === currentScreen.screenName &&
      JSON.stringify(latestScreen.params || {}) === JSON.stringify(currentScreen.params || {});
  
    if (isSame) {
      setActiveScreenFn("", {});
    } else if (latestScreen) {
      setActiveScreenFn(latestScreen.screenName, latestScreen.params);
    }
  };

  const closeParallax = (mapConfig: number | null) => {
    const currentScreen: ActiveSceen = activeScreen;
    setSavedTranslateY(translateY.value)
    setBottomHitCount(1)
    translateY.value = withTiming(0, { duration: 100 }, (finished) => {
      if (finished) {
        translateY.value = 0;
        startY.value = 0;

        if(!editInfo){
          runOnJS(updateActiveScreen)(currentScreen, currentScreen, setActiveScreen);
          runOnJS(setEditInfo)(null);
        } else {
          runOnJS(setEditInfo)(null);
        }
 
  
        if (mapConfig === 1) {
          runOnJS(onMapFlip)();
        } else {
          runOnJS(setSavedTranslateY)(HALF_HEIGHT)
          runOnJS(onClose)();
        }
      }
    });
  };

  const restoreParallax = () => {
    translateY.value = withTiming(savedTranslateY, {
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
    bottomHitCount
  };
};
