import { StyleSheet, Dimensions } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { activeFonts, colors, fontSizes } from "../styles";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scale, moderateScale } from "react-native-size-matters";
import DiveSiteButton from "./diveSiteButton";
import SiteSearchButton from "./siteSearchButton";
import GuidesButton from "./guidesButton";
import ItineraryListButton from "./itineraryCreatorButton";
import ProfileButton from "./profileButton";
import { UserProfileContext } from "../contexts/userProfileContext";

let numbButtons = 0;

export default function FABMenu() {
  const windowWidth = Dimensions.get("window").width;
  const [fabMenuSize, setFabMenuSize] = useState(0);
  const { profile } = useContext(UserProfileContext);

  const PARTNER_ACCOUNT_STATUS = profile[0] && profile[0].partnerAccount || false

  numbButtons = 5

  useEffect(() => {
    setFabMenuSize(numbButtons * moderateScale(80));
  }, []);

  const xValue = useSharedValue((windowWidth/2)-(numbButtons * moderateScale(80)/2));
  const context = useSharedValue({ x: 0 });
  let bounds = moderateScale(180)
  let startBounce = moderateScale(90)

  const animateFabMenu = Gesture.Pan()
    .onBegin(() => {
      if (xValue.value > fabMenuSize / 2 - bounds) {
        xValue.value = fabMenuSize / 2 - startBounce;
      } else if (xValue.value < -fabMenuSize / 2 + bounds) {
        xValue.value = -fabMenuSize / 2 + startBounce;
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
      if(fabMenuSize > windowWidth) {
        if (xValue.value > (0)) {
          xValue.value = (0);
        } else if (xValue.value < -(fabMenuSize/2)) {
          xValue.value = windowWidth - fabMenuSize;
        }
      } else {
        if (xValue.value > (0)) {
          xValue.value = ((windowWidth - fabMenuSize) /2);
        } else if (xValue.value < -(fabMenuSize/2)) {
          xValue.value = windowWidth - fabMenuSize - (windowWidth - fabMenuSize) /2;
        }
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
          { minWidth: numbButtons * moderateScale(80) },
        ]}
      >
              <ProfileButton/>
              <SiteSearchButton/>
              <DiveSiteButton/>
              {PARTNER_ACCOUNT_STATUS ? <ItineraryListButton /> : <GuidesButton/>}

      
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
    elevation: 90,
    width: numbButtons * moderateScale(80)
  }
});
