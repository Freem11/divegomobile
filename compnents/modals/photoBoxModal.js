import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";
import * as FileSystem from "expo-file-system";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PhotoBoxModal(props) {

  const { picData, togglePhotoBoxModal } = props;

  let fileName = picData && picData.split("/").pop();
  let cacheDir = false;

  if (fileName) {
    cacheDir = FileSystem.cacheDirectory + fileName;
  }

  const [photoCloseState, setPhotoCloseState] = useState(false);

  useEffect(() => {
      scaleValue.value = 1
      focalX.value = 0
      focalY.value = 0
  }, [picData])

  const scaleValue = useSharedValue(1);
  const lastScaleValue = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });
  
  const animateTaps = Gesture.Tap().numberOfTaps(2).onEnd((event, success) => {
     if (success){
       scaleValue.value = 1
       focalX.value = 0
       focalY.value = 0
     }
});

  const animatePan = Gesture.Pan()
  // .onBegin(() => {
  //   if (xValue.value > picMenuSize / 2 - 180) {
  //     xValue.value = picMenuSize / 2 - 175;
  //   } else if (xValue.value < -picMenuSize / 2 + 180) {
  //     xValue.value = -picMenuSize / 2 + 175;
  //   }
  // })
  .onStart(() => {
    context.value = { x: focalX.value, y: focalY.value };
  })
  .onUpdate((event) => {
      focalX.value = (-event.translationY + context.value.x);
      focalY.value = (event.translationX + context.value.y);
  })
  // .onEnd((event) => {
  //   if (xValue.value > picMenuSize / 2 - 180) {
  //     xValue.value = picMenuSize / 2 - 175;
  //   } else if (xValue.value < -picMenuSize / 2 + 180) {
  //     xValue.value = -picMenuSize / 2 + 175;
  //   }
  // });

  const animatePicPinch = Gesture.Pinch()
    .onBegin(() => {
      // scaleValue.value = lastScaleValue.value
    })
    .onStart(() => {
      context.value = { x: focalX.value, y: focalX.value };
      // scaleValue.value = lastScaleValue.value
    })
    .onUpdate((event) => {
      if (event.numberOfPointers === 2){
      scaleValue.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
      }
      
    })
    .onEnd((event) => {
      lastScaleValue.value = scaleValue.value
    });

  const combinedAnimations = Gesture.Simultaneous(animatePicPinch, animatePan, animateTaps)

  const animatedPictureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -windowHeight / 2 },
        { translateY: -windowWidth },
        { scale: scaleValue.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: windowHeight / 2 },
        { translateY: windowWidth },
      ],
    };
  });

  const animatedPictureFocalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <View
          style={
            photoCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={() => togglePhotoBoxModal()}
            onPressIn={() => setPhotoCloseState(true)}
            onPressOut={() => setPhotoCloseState(false)}
            style={{
              width: scale(40),
              height: scale(40),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableOpacity>
        </View>
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
                  height: windowWidth - windowWidth * 0.15,
                  width: windowHeight - windowHeight * 0.15,
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
    marginTop: scale(-70),
    marginLeft: scale(-35),
  },
  title: {
    position: "absolute",
    top: "6%",
    left: "60%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "2%",
    marginLeft: "12%",
    width: "20%",
    height: scale(30),
    zIndex: 5
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
