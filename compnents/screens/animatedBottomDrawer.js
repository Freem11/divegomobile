import { StyleSheet, View, Dimensions, FlatList } from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import Picture from "../modals/picture";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function BottomDrawer(props) {
  const { dataSet, lowerBound, upperBound} = props
  const photosRef = useRef(null);
  const boxheight = useSharedValue(moderateScale(280));

  const [bounds, setBounds] = useState({});

  useEffect(() => {
    setBounds({lower: lowerBound, upper: upperBound})
  }, []);

  const animatedBottomDrawer = Gesture.Pan()
    .onUpdate((event) => {
      if(event.translationY < 0){
        boxheight.value = bounds.upper
      } else {
        boxheight.value = bounds.lower
      }
    })

  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
          height: withTiming(boxheight.value, {
            duration: 500,
            easing: Easing.inOut(Easing.linear),
          }),
        }
  });

  return (
    <GestureDetector gesture={animatedBottomDrawer}>
      <Animated.View
        style={[
          styles.mainHousing,
          animatedBoxStyle,
        ]}
      >
        {/* <FlatList
          style={styles.page}
          contentContainerStyle={styles.pageContainer}
          ref={photosRef}
          pagingEnabled
          horizontal={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={moderateScale(290)}
          snapToAlignment="center"
          decelerationRate="fast"
          disableIntervalMomentum
          keyExtractor={(item) => item.id}
          data={dataSet}
          renderItem={({ item }) => (
            <View style={styles.shadowbox}>
              <Picture key={item.id} pic={item}></Picture>
            </View>
          )}
        /> */}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  mainHousing: {
    position: "absolute",
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 10,
    width: windowWidth,
    borderTopRightRadius: moderateScale(10),
    borderTopLeftRadius: moderateScale(10),
    backgroundColor: "white"
  },
  shadowbox: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
  },
});
