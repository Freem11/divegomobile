import { StyleSheet, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";
import PhotoButton from "./photoButton";
import DiveSiteButton from "./diveSiteButton";
import SiteSearchButton from "./siteSearchButton";
import LocationSearchButton from "./locationSearchButton";
import SettingsButton from "./settingsButton";
import GuidesButton from "./guidesButton";

export default function FABMenu() {
  let numbButtons = 6;
  const [fabMenuSize, setFabMenuSize] = useState(0);

  useEffect(() => {
    setFabMenuSize(numbButtons * 70);
  }, []);

  const xValue = useSharedValue(0);
  const context = useSharedValue({ x: 0 });

  const animateFabMenu = Gesture.Pan()
    .onBegin(() => {
      if (xValue.value > fabMenuSize / 2 - 180) {
        xValue.value = fabMenuSize / 2 - 175;
      } else if (xValue.value < -fabMenuSize / 2 + 180) {
        xValue.value = -fabMenuSize / 2 + 175;
      }
    })
    .onStart(() => {
      context.value = { x: xValue.value };
    })
    .onUpdate((event) => {
      if (event.velocityX > 400 || event.velocityX < -400) {
        xValue.value = event.translationX * 3 + context.value.x;
      } else if (event.velocityX > 600 || event.velocityX < -600) {
        xValue.value = event.translationX * 5 + context.value.x;
      } else {
        xValue.value = event.translationX + context.value.x;
      }
    })
    .onEnd((event) => {
      if (xValue.value > fabMenuSize / 2 - 180) {
        xValue.value = fabMenuSize / 2 - 145;
      } else if (xValue.value < -fabMenuSize / 2 + 180) {
        xValue.value = -fabMenuSize / 2 + 145;
      }
    });

  const animatedFabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(xValue.value, {
            duration: 500,
            easing: Easing.inOut(Easing.linear),
          }),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={animateFabMenu}>
      <Animated.View
        style={[
          styles.container2,
          animatedFabBarStyle,
          { minWidth: numbButtons * 90 },
        ]}
      >
              <SettingsButton/>
              <LocationSearchButton/>
              <PhotoButton/>
              <DiveSiteButton/>
              <SiteSearchButton/>
              <GuidesButton/>
      
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    zIndex: 90,
    elevation: 90
  },
  picContainer2: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    // marginTop: scale(10),
  },
  titleText: {
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(15),
    marginLeft: scale(12),
  },
  noSightings: {
    width: scale(200),
    alignItems: "center",
    textAlign: "center",
    marginTop: scale(15),
    fontFamily: "Itim_400Regular",
    fontSize: scale(15),
    color: "#F0EEEB",
  },
});
