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
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { ActiveScreenContext } from "../../contexts/activeScreenContext";
import { EditsContext } from "../../contexts/editsContext";
import { SavedTranslateYContext } from "../../contexts/savedTranslateYContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
const HALF_HEIGHT = SCREEN_HEIGHT / 2;
const TOP_SECTION_HEIGHT = moderateScale(70);
const DECELERATION = 0.985;

export const useParallaxDrawer = (onClose: () => void, onMapFlip?: () => void) => {
  const translateY = useSharedValue(HALF_HEIGHT);
  const contentHeight = useSharedValue(0);
  const startY = useSharedValue(0);
  // const savedTranslateY = useSharedValue(0);
  const [bottomHitCount, setBottomHitCount] = useState(1);
  const hasHitBottom = useSharedValue(false);

  const { levelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);
  const { fullScreenModal } = useContext(FullScreenModalContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { editInfo, setEditInfo } = useContext(EditsContext);

  const { savedTranslateY, setSavedTranslateY } = useContext(SavedTranslateYContext);

  useEffect(() => {
    if (fullScreenModal && savedTranslateY === HALF_HEIGHT) {
      translateY.value = HALF_HEIGHT;
      startY.value = HALF_HEIGHT;
    }
  }, [fullScreenModal]);


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

  useAnimatedReaction(
    () => contentHeight.value,
    (newHeight, prevHeight) => {
      if (newHeight !== prevHeight && newHeight > 0) {
        const desiredY = HALF_HEIGHT;
  
        // Only snap to half height if drawer is below or near bottom (closed)
        if (translateY.value >= SCREEN_HEIGHT - 10) {
          translateY.value = withTiming(desiredY, { duration: 300 });
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

  const updateActiveScreen = (latestScreen: string | null, setActiveScreenFn: React.Dispatch<React.SetStateAction<string | null>>) => {
    setActiveScreenFn((prev) => {
      if (prev === latestScreen) {
        return null;
      }
      return prev;
    });
  };

  const closeParallax = (mapConfig: number | null) => {
    const currentScreen = activeScreen;
    setSavedTranslateY(translateY.value)
    translateY.value = withTiming(0, { duration: 100 }, (finished) => {
      if (finished) {
        translateY.value = 0;
        startY.value = 0;

        if(!editInfo){
          runOnJS(updateActiveScreen)(currentScreen, setActiveScreen);
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
