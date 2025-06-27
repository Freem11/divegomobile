import { useEffect } from "react";
import { Dimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export function usePinchAndZoomAnimation(dependencies: any[] = []) {
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const xCurrent = useSharedValue(0);
  const yCurrent = useSharedValue(0);
  const xPrevious = useSharedValue(0);
  const yPrevious = useSharedValue(0);
  const scaleCurrent = useSharedValue(1);
  const scalePrevious = useSharedValue(1);
  const xOffset = useSharedValue(0);
  const yOffset = useSharedValue(0);
  const pinchActive = useSharedValue(false);
  const context = useSharedValue({ x: 0, y: 0, fx: 0, fy: 0 });

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;

  useEffect(() => {
    scaleCurrent.value = 1;
    scalePrevious.value = 1;
    focalX.value = 0;
    focalY.value = 0;
    xCurrent.value = 0;
    xPrevious.value = 0;
    yCurrent.value = 0;
    yPrevious.value = 0;
    xOffset.value = 0;
    yOffset.value = 0;
  }, dependencies);

  const animateTaps = Gesture.Tap()
    .maxDistance(10)
    .numberOfTaps(2)
    .onEnd((_, success) => {
      if (success) {
        scaleCurrent.value = 1;
        scalePrevious.value = 1;
        focalX.value = 0;
        focalY.value = 0;
        xCurrent.value = 0;
        xPrevious.value = 0;
        yCurrent.value = 0;
        yPrevious.value = 0;
        xOffset.value = 0;
        yOffset.value = 0;
      }
    });

  const animatePan = Gesture.Pan()
    .onStart(() => {
      context.value = {
        x: xCurrent.value,
        y: yCurrent.value,
        fx: focalX.value,
        fy: focalY.value,
      };
    })
    .onUpdate((event) => {
      xCurrent.value = event.translationY / scalePrevious.value + context.value.x;
      yCurrent.value = -event.translationX / scalePrevious.value + context.value.y;
    })
    .onEnd((event) => {
      if (pinchActive.value) return;

      xCurrent.value = withDecay({
        velocity: event.velocityY / scalePrevious.value,
        clamp: [-windowWidth * scalePrevious.value * 1.6, windowWidth * scalePrevious.value * 1.6],
        deceleration: 0.997,
      });

      yCurrent.value = withDecay({
        velocity: -event.velocityX / scalePrevious.value,
        clamp: [-windowHeight * scalePrevious.value * 0.4, windowHeight * scalePrevious.value * 0.4],
        deceleration: 0.997,
      });
    });

  const animatePinch = Gesture.Pinch()
    .onStart((event) => {
      if (event.numberOfPointers === 2) {
        focalX.value = event.focalX;
        focalY.value = event.focalY;
        pinchActive.value = true;
      }
    })
    .onUpdate((event) => {
      if (event.numberOfPointers === 2) {
        scaleCurrent.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, event.scale));
        xCurrent.value =
          (1 - scaleCurrent.value) * (focalX.value - windowWidth / 2) + xOffset.value;
        yCurrent.value =
          (1 - scaleCurrent.value) * (focalY.value - windowHeight / 2) + yOffset.value;
      }
    })
    .onEnd(() => {
      const finalScale = scalePrevious.value * scaleCurrent.value;
      const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, finalScale));

      scalePrevious.value = clampedScale;
      xPrevious.value = scaleCurrent.value * xPrevious.value + xCurrent.value;
      yPrevious.value = scaleCurrent.value * yPrevious.value + yCurrent.value;

      scaleCurrent.value = 1;
      xCurrent.value = 0;
      yCurrent.value = 0;
      pinchActive.value = false;
    });

  const combinedGestures = Gesture.Simultaneous(animatePinch, animatePan, animateTaps);

  const animatedPictureStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xPrevious.value },
      { translateY: yPrevious.value },
      { scale: scalePrevious.value },
      { translateX: xCurrent.value },
      { translateY: yCurrent.value },
      { scale: scaleCurrent.value },
    ],
  }));

  const animatedPictureFocalStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
  }));

  return {
    gesture: combinedGestures,
    animatedPictureStyle,
    animatedPictureFocalStyle,
  };
}
