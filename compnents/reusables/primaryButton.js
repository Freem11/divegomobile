import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FontAwesome } from "@expo/vector-icons";

export default function PrimaryButton(props) {
  const { buttonAction, icon, label, bgColor, bgPressedColor, followed } =
    props;

  const [isPressed, setIsPressed] = useState(false);

  let applyBgStyle
  let applyFntStyle

if(followed) {
  applyBgStyle = styles.FollowButtonPressed
  applyFntStyle = styles.FollowButtonText
} else if (isPressed && bgColor) {
  applyBgStyle = styles.buttonBackgroundPressedAlt
  applyFntStyle = styles.buttonTextAlt
} else if (!isPressed && bgPressedColor){
  applyBgStyle = styles.buttonBackgroundAlt
  applyFntStyle = styles.buttonTextAlt
} else if (isPressed && !bgColor) {
  applyBgStyle = styles.buttonBackgroundPressed
  applyFntStyle = styles.buttonText
} else if (!isPressed && !bgPressedColor){
  applyBgStyle = styles.buttonBackground
  applyFntStyle = styles.buttonText
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
        {icon && (
          <FontAwesome name={icon} size={moderateScale(24)} color="gold" />
        )}
        <Text style={applyFntStyle}>
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonBackground: {
    backgroundColor: "#538dbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: moderateScale(40),
    height: moderateScale(45),
    width: moderateScale(200),
    marginLeft: 0,
    marginTop: moderateScale(15),
    marginBottom: moderateScale(-10),
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 10,
  },
  buttonBackgroundPressed: {
    backgroundColor: "#6498c3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: moderateScale(40),
    height: moderateScale(45),
    width: moderateScale(200),
    marginLeft: 0,
    marginTop: moderateScale(15),
    marginBottom: moderateScale(-10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    elevation: 10,
  },
  buttonText: {
    color: "gold",
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(17),
  },
  buttonBackgroundAlt: {
    backgroundColor: "pink",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: moderateScale(40),
    height: moderateScale(45),
    width: moderateScale(200),
    marginLeft: 0,
    marginTop: moderateScale(15),
    marginBottom: moderateScale(-10),
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 5,
    shadowRadius: 6,

    elevation: 10,
  },
  buttonBackgroundPressedAlt: {
    backgroundColor: "#ffccd5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: moderateScale(40),
    height: moderateScale(45),
    width: moderateScale(200),
    marginLeft: 0,
    marginTop: moderateScale(15),
    marginBottom: moderateScale(-10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    elevation: 10,
  },
  buttonTextAlt: {
    color: "maroon",
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(17),
  },
  FollowButtonPressed: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: moderateScale(40),
    height: moderateScale(45),
    width: moderateScale(200),
    marginLeft: 0,
    marginTop: moderateScale(15),
    marginBottom: moderateScale(-10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    elevation: 10,
  },
  FollowButtonText: {
    color: "black",
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(17),
  },
});
