import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import { scale } from "react-native-size-matters";
import CloseButton from "../reusables/closeButton";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { SelectedPhotoContext } from "../contexts/selectedPhotoContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PhotoBoxModal() {
  const { fullScreenModal, setFullScreenModal } = useContext(FullScreenModalContext);
  const { selectedPhoto } = useContext(SelectedPhotoContext);
  const [picHeigth, setPicHeigth] = useState(0);
  const [picWidth, setPicWidth] = useState(0);

  let fileName = selectedPhoto && selectedPhoto.split("/").pop();
  let cacheDir = false;

  if (fileName) {
    cacheDir = FileSystem.cacheDirectory + fileName;
  }

  if (cacheDir) {
    Image.getSize(cacheDir, (width, height) => {
      let ratio = height / width;
      setPicWidth(windowHeight * 0.85);
      setPicHeigth(windowHeight * ratio * 0.85);
    });
  }

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

  const context = useSharedValue({ x: 0, y: 0, fx: 0, fy: 0 });

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
      xCurrent.value = withTiming(event.translationY + context.value.x, {
        easing: Easing.out(Easing.ease),
      });
      yCurrent.value = withTiming(-event.translationX + context.value.y, {
        easing: Easing.out(Easing.ease),
      });

      // xOffset.value = event.translationY + context.value.x;
      // yOffset.value = -event.translationX + context.value.y;
    })
    .onEnd(() => {
      let tempX = xCurrent.value; //height
      let tempY = yCurrent.value; //width

      xOffset.value = xCurrent.value;
      yOffset.value = yCurrent.value;

      if (tempX > ((windowHeight * scalePrevious.value) / 2) * 0.8) {
        xCurrent.value = withTiming(
          windowHeight / 2 - 100 * scaleCurrent.value,
          {
            duration: 400 * scaleCurrent.value,
            easing: Easing.out(Easing.ease),
          }
        );
      }

      if (-tempX > ((windowHeight * scalePrevious.value) / 2) * 0.8) {
        xCurrent.value = withTiming(
          -windowHeight / 2 + 100 * scaleCurrent.value,
          {
            duration: 400 * scaleCurrent.value,
            easing: Easing.out(Easing.ease),
          }
        );
      }

      if (tempY > ((windowWidth * scalePrevious.value) / 2) * 0.8) {
        yCurrent.value = withTiming(
          windowWidth / 2 - 100 * scaleCurrent.value,
          {
            duration: 400 * scaleCurrent.value,
            easing: Easing.out(Easing.ease),
          }
        );
      }

      if (-tempY > ((windowWidth * scalePrevious.value) / 2) * 0.8) {
        yCurrent.value = withTiming(
          -windowWidth / 2 + 100 * scaleCurrent.value,
          {
            duration: 400 * scaleCurrent.value,
            easing: Easing.out(Easing.ease),
          }
        );
      }
    });

  const animatePicPinch = Gesture.Pinch()
    .onStart((event) => {
      if (event.numberOfPointers == 2) {
        focalX.value = event.focalX;
        focalY.value = event.focalY;
      }
    })
    .onUpdate((event) => {
      if (event.numberOfPointers == 2) {
        // On Android, the onStart event gives 0,0 for the focal
        // values, so we set them here instead too.
        if (event.oldState === 2) {
          focalX.value = event.focalX;
          focalY.value = event.focalY;
        }
        scaleCurrent.value = event.scale;

        xCurrent.value =
          (1 - scaleCurrent.value) * (focalX.value - windowWidth / 2) +
          xOffset.value;
        yCurrent.value =
          (1 - scaleCurrent.value) * (focalY.value - windowHeight / 2) +
          yOffset.value;
      }

      // xPrevious.value = scaleCurrent.value * xPrevious.value + xCurrent.value;
      // yPrevious.value = scaleCurrent.value * yPrevious.value + yCurrent.value;
    })
    .onEnd(() => {
      let tempScale = scalePrevious.value * scaleCurrent.value;
      scalePrevious.value = scalePrevious.value * scaleCurrent.value;
      let tempX = scaleCurrent.value * xPrevious.value + xCurrent.value;
      let tempY = scaleCurrent.value * yPrevious.value + yCurrent.value;

      if (tempScale > 4) {
        scalePrevious.value = withTiming(4, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        });
      } else if (tempScale < 1) {
        scalePrevious.value = withTiming(1, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        });
      } else {
        scalePrevious.value = withTiming(scalePrevious.value, {
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        });
      }

      if (tempX > windowWidth / 2 || -tempX > windowWidth / 2) {
        if (tempX < 0) {
          xPrevious.value = withTiming(
            (-windowHeight / 2 + 100) * scaleCurrent.value,
            { duration: 400, easing: Easing.inOut(Easing.ease) }
          );
        } else {
          xPrevious.value = withTiming(
            (windowHeight / 2 - 100) * scaleCurrent.value,
            { duration: 400, easing: Easing.inOut(Easing.ease) }
          );
        }
      } else {
        xPrevious.value = scaleCurrent.value * xPrevious.value + xCurrent.value;
      }

      if (tempY > windowHeight / 2 || -tempY > windowHeight / 2) {
        if (tempY < 0) {
          yPrevious.value = withTiming(
            (-windowWidth / 2 + 100) * scaleCurrent.value,
            { duration: 400, easing: Easing.inOut(Easing.ease) }
          );
        } else {
          yPrevious.value = withTiming(
            (windowWidth / 2 - 100) * scaleCurrent.value,
            { duration: 400, easing: Easing.inOut(Easing.ease) }
          );
        }
      } else {
        yPrevious.value = scaleCurrent.value * yPrevious.value + yCurrent.value;
      }

      // xPrevious.value = scaleCurrent.value * xPrevious.value + xCurrent.value;
      // yPrevious.value = scaleCurrent.value * yPrevious.value + yCurrent.value;

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
        { translateX: xCurrent.value },
        { translateY: yCurrent.value },
        { scale: scaleCurrent.value },
        { translateX: xPrevious.value },
        { translateY: yPrevious.value },
        { scale: scalePrevious.value },
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
    <View style={styles.container}>
      <View style={styles.closeButton}>
        <CloseButton onClose={onCloseModal} />
      </View>

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
              style={[
                animatedPictureStyle,
                {
                  height: picHeigth,
                  width: picWidth,
                  borderRadius: 15,
                },
              ]}
            />
          )}

          <Animated.View
            style={[styles.focalPoint, animatedPictureFocalStyle]}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    zIndex: 26
  },
  closeButton: {
    position: "absolute",
    top: "12%",
    left: "62%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "2%",
    marginLeft: "12%",
    width: "20%",
    height: scale(30),
    zIndex: 5,
  },
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    borderRadius: 10,
    // backgroundColor: "blue"
  },
});
