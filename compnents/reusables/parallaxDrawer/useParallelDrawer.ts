import { Dimensions, Keyboard, KeyboardEvent } from "react-native";
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
const TOP_SECTION_HEIGHT = moderateScale(70);
const DECELERATION = 0.985;

export const useParallaxDrawer = (onClose: () => void, onMapFlip?: () => void) => {
  const translateY = useSharedValue(SCREEN_HEIGHT / 2);
  const contentHeight = useSharedValue(0);
  const startY = useSharedValue(0);
  const [bottomHitCount, setBottomHitCount] = useState(1);
  const hasHitBottom = useSharedValue(false);
  const keyboardOffset = useSharedValue(0);
  const dynamicScreenHeight = useSharedValue(SCREEN_HEIGHT);

  const getHalfHeight = () => {
    "worklet";
    return dynamicScreenHeight.value / 2;
  };

  const { levelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const activeScreen = useActiveScreenStore((state) => state.activeScreen);

  const { editInfo, setEditInfo } = useContext(EditsContext);
  const { savedTranslateY, setSavedTranslateY } = useContext(SavedTranslateYContext);

  useEffect(() => {
    if (levelOneScreen && savedTranslateY === SCREEN_HEIGHT / 2) {
      translateY.value = SCREEN_HEIGHT / 2;
      startY.value = SCREEN_HEIGHT / 2;
    }
  }, [levelOneScreen]);

  useEffect(() => {
    if (levelTwoScreen && savedTranslateY === SCREEN_HEIGHT / 2) {
      translateY.value = SCREEN_HEIGHT / 2;
      startY.value = SCREEN_HEIGHT / 2;
    }
  }, [levelTwoScreen]);

useEffect(() => {
  const onKeyboardShow = (e: KeyboardEvent) => {
    const height = e.endCoordinates.height;
    const diff = height - keyboardOffset.value;
    if (diff > 0) {
      keyboardOffset.value = height;
      dynamicScreenHeight.value = SCREEN_HEIGHT - height;

      translateY.value = withTiming(translateY.value - diff, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      });
    }
  };

  const onKeyboardHide = () => {
    dynamicScreenHeight.value = SCREEN_HEIGHT;

    translateY.value = withTiming(translateY.value + keyboardOffset.value, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
    keyboardOffset.value = 0;
  };

  const showSub = Keyboard.addListener("keyboardDidShow", onKeyboardShow);
  const hideSub = Keyboard.addListener("keyboardDidHide", onKeyboardHide);

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);


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

      if (contentShrankSignificantly) {
        lastAdjustedHeightRef.value = newHeight;

        const minTranslateY = Math.min(
          dynamicScreenHeight.value - newHeight - TOP_SECTION_HEIGHT,
          getHalfHeight()
        );

        if (currentY < minTranslateY) {
          translateY.value = withTiming(minTranslateY, { duration: 300 });
        }
      }
    }
  );

  const handleDrawerHitBottom = () => {
    setBottomHitCount((prev) => prev + 1);
    setTimeout(() => {
      hasHitBottom.value = false;
    }, 1000);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const rawMinY = dynamicScreenHeight.value - contentHeight.value - TOP_SECTION_HEIGHT;
      const halfHeight = getHalfHeight();
      const isShortContent = contentHeight.value + TOP_SECTION_HEIGHT < halfHeight;
      const minY = isShortContent ? halfHeight : rawMinY;
      const maxY = halfHeight;

      const nextY = startY.value + event.translationY;
      translateY.value = Math.min(maxY, Math.max(minY, nextY));

      const isAtBottom = Math.abs(translateY.value - minY) < 2000;
      if (isAtBottom && !hasHitBottom.value) {
        hasHitBottom.value = true;
        runOnJS(handleDrawerHitBottom)();
      }
    })
    .onEnd((event) => {
      const rawMinY = dynamicScreenHeight.value - contentHeight.value - TOP_SECTION_HEIGHT;
      const halfHeight = getHalfHeight();
      const isShortContent = contentHeight.value + TOP_SECTION_HEIGHT < halfHeight;
      const minY = isShortContent ? halfHeight : rawMinY;
      const maxY = halfHeight;

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
            if (translateY.value > maxY) {
              translateY.value = withTiming(maxY, {
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
      [0, getHalfHeight(), dynamicScreenHeight.value],
      [1, 1.25, 3.25]
    );
    return { transform: [{ scale }] };
  });

  const animatedSafeAreaStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [getHalfHeight(), 0],
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
    setSavedTranslateY(translateY.value);
    setBottomHitCount(1);

    translateY.value = withTiming(0, { duration: 100 }, (finished) => {
      if (finished) {
        translateY.value = 0;
        startY.value = 0;

        if (!editInfo) {
          runOnJS(updateActiveScreen)(currentScreen, currentScreen, setActiveScreen);
          runOnJS(setEditInfo)(null);
        } else {
          runOnJS(setEditInfo)(null);
        }

        if (mapConfig === 1) {
          runOnJS(onMapFlip)();
        } else {
          runOnJS(setSavedTranslateY)(getHalfHeight());
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
    bottomHitCount,
  };
};
