import {
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
} from "react-native-reanimated";
import {
  colors,
} from "../../styles";
import * as S from "./styles";
import * as FileSystem from "expo-file-system";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React, { useEffect, useContext } from "react";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { SelectedPhotoContext } from "../../contexts/selectedPhotoContext";
import ButtonIcon from "../../reusables/buttonIcon";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PhotoBoxModal() {
  const { fullScreenModal, setFullScreenModal } = useContext(FullScreenModalContext);
  const { selectedPhoto } = useContext(SelectedPhotoContext);
  let fileName = selectedPhoto && selectedPhoto.split("/").pop();
  let cacheDir = null;

  if (fileName) {
    cacheDir = FileSystem.cacheDirectory + fileName;
  }

  // Shared values
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

  // Flag to track if pinch is active
  const pinchActive = useSharedValue(false);

  const context = useSharedValue({ x: 0, y: 0, fx: 0, fy: 0 });

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
  }, [selectedPhoto, fullScreenModal]);

  const animateTaps = Gesture.Tap()
    .maxDistance(10)
    .numberOfTaps(2)
    .onEnd((event, success) => {
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
      if (pinchActive.value) {
        return;
      }
  
      const velocityX = event.velocityY / scalePrevious.value;
      const velocityY = -event.velocityX / scalePrevious.value;
  
      xCurrent.value = withDecay({
        velocity: velocityX,
        clamp: [
          -((windowWidth * scalePrevious.value) * 2) * 0.8,
          ((windowWidth * scalePrevious.value) * 2) * 0.8,
        ],
        deceleration: 0.997,
      });
  
      yCurrent.value = withDecay({
        velocity: velocityY,
        clamp: [
          -((windowHeight * scalePrevious.value) / 2) * 0.8,
          ((windowHeight * scalePrevious.value) / 2) * 0.8,
        ],
        deceleration: 0.997,
      });
    });

  const MIN_SCALE = 0.5; // allow shrinking down to half size
  const MAX_SCALE = 4;   // max zoom

  const animatePicPinch = Gesture.Pinch()
  .onStart((event) => {
    if (event.numberOfPointers === 2) {
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    }
  })
  .onUpdate((event) => {
    if (event.numberOfPointers === 2) {
      if (event.oldState === 2) {
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      }
      // Clamp scale to allow shrinking below 1
      scaleCurrent.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, event.scale));

      // Update position based on scale and focal point
      xCurrent.value =
        (1 - scaleCurrent.value) * (focalX.value - windowWidth / 2) +
        xOffset.value;
      yCurrent.value =
        (1 - scaleCurrent.value) * (focalY.value - windowHeight / 2) +
        yOffset.value;
    }
  })
.onEnd(() => {
  // Compute final scale
  let finalScale = scalePrevious.value * scaleCurrent.value;
  let clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, finalScale));

  // Compute the new persistent translation
  const finalX = scaleCurrent.value * xPrevious.value + xCurrent.value;
  const finalY = scaleCurrent.value * yPrevious.value + yCurrent.value;

  // Immediately set new persistent values (no animation)
  scalePrevious.value = clampedScale;
  xPrevious.value = finalX;
  yPrevious.value = finalY;

  // Reset temporary values
  xCurrent.value = 0;
  yCurrent.value = 0;
  scaleCurrent.value = 1;
});
    

  const combinedAnimations = Gesture.Simultaneous(
    animatePicPinch,
    animatePan,
    animateTaps
  );

  const animatedPictureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: xPrevious.value },
        { translateY: yPrevious.value },
        { scale: scalePrevious.value },
        { translateX: xCurrent.value },
        { translateY: yCurrent.value },
        { scale: scaleCurrent.value },
      ],
    };
  });

  const animatedPictureFocalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
    };
  });

  const onCloseModal = () => {
    setFullScreenModal(false);
  };

  return (
    <S.ContentContainer>
      <S.BackButtonWrapper>
        <ButtonIcon
          icon="chevron-left"
          onPress={() => onCloseModal()}
          size="small"
          fillColor={colors.themeWhite}
        />
      </S.BackButtonWrapper>

      <GestureDetector gesture={combinedAnimations}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ rotate: "90deg" }],
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {cacheDir && (
            <Animated.Image
              source={{
                uri: cacheDir,
              }}
              onError={(e) => {
                console.log('Image load error:', e.nativeEvent.error);
              }}
              style={[
                animatedPictureStyle,
                {
                  width: windowHeight,
                  aspectRatio: 1,
                  borderRadius: 15,
                  resizeMode: "contain",
                },
              ]}
            />
          )}

          <Animated.View
            style={[styles.focalPoint, animatedPictureFocalStyle]}
          />
        </Animated.View>
      </GestureDetector>
    </S.ContentContainer>
  );
}

const styles = StyleSheet.create({
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
