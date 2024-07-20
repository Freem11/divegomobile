import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableWithoutFeedback ,Text } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function TinyButton(props) {
  const { buttonAction, icon, buttonText } = props;
  const [isPressed, setIsPressed] = useState(false);

  let applyBgStyle;
  let applyFntStyle;

  if (!isPressed) {
    applyBgStyle = styles.buttonBackground;
    applyFntStyle = styles.buttonText;
  } else if (isPressed) {
    applyBgStyle = styles.buttonBackgroundPressed;
    applyFntStyle = styles.buttonText;
  }


  return (
    <TouchableWithoutFeedback
      onPress={buttonAction}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View
        style={applyBgStyle}
      >
        <Text style={applyFntStyle}>{buttonText}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonBackground: {
    borderRadius: moderateScale(10),
    backgroundColor: "#538dbd",
    width: moderateScale(56),
    height: moderateScale(30),
    paddingRight: moderateScale(1),
    paddingRight: moderateScale(1),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  buttonBackgroundPressed: {
    borderRadius: moderateScale(10),
    backgroundColor: "#6498c3",
    width: moderateScale(56),
    height: moderateScale(30),
    paddingRight: moderateScale(1),
    paddingRight: moderateScale(1),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  buttonBackgroundAlt: {
    borderRadius: moderateScale(40),
    backgroundColor: "pink",
    width: moderateScale(65),
    height: moderateScale(35),
    marginTop: "3%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  buttonBackgroundPressedAlt: {
    borderRadius: moderateScale(40),
    backgroundColor: "#ffccd5",
    width: moderateScale(65),
    height: moderateScale(35),
    marginTop: "3%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  buttonText: {
    color: "gold",
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(10),
  },
  buttonTextAlt: {
    color: "black",
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(10),
  },
});
