import { Dimensions } from "react-native";
import {
  Easing,
  runOnJS,
  withDecay,
  withTiming,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { useContext } from "react";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");
const HALF_HEIGHT = SCREEN_HEIGHT / 2;
const TOP_SECTION_HEIGHT = moderateScale(70);
const DECELERATION = 0.985;

export const useParallaxDrawer = (onClose: () => void, onMapFlip?: () => void) => {
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext)
  
  const translateY = useSharedValue(HALF_HEIGHT);
  const contentHeight = useSharedValue(0);
  const startY = useSharedValue(0);

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
    // Cancel ongoing animations before modifying values
    cancelAnimation(translateY);
  
    // Log before resetting to check the state
    console.log("before", translateY.value, startY.value);
  
    // Explicitly reset translateY and startY to their default state
    translateY.value = 0;
    startY.value = 0;
  
    // Now perform the animation to close the drawer
    translateY.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        // Log after the animation finishes
        console.log("after", translateY.value, startY.value);
  
        // After the drawer is fully closed, check the mapConfig
        if (mapConfig === 3) {
          // Ensure translateY is explicitly set to 0 again before triggering onMapFlip
          translateY.value = 0;
  
          // Now run map flip logic (use runOnJS to safely call from the JS thread)
          runOnJS(onMapFlip)();
        } else {
          // If no map flip, just close the drawer and trigger onClose
          runOnJS(onClose)();
        }
      }
    });
  };
  
  

  return {
    SCREEN_WIDTH,
    panGesture,
    animatedDrawerStyle,
    animatedBackgroundStyle,
    animatedSafeAreaStyle,
    contentHeight,
    closeParallax
  };
};
