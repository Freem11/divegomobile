import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MaterialCommunityIconsButton(props) {
  const { buttonAction, icon, iconColour, buttonText, altStyle } = props;
  const [isPressed, setIsPressed] = useState(false);

  let applyBgStyle;
  let applyFntStyle;

  if (!isPressed && !altStyle) {
    applyBgStyle = styles.buttonBackground;
    applyFntStyle = styles.buttonText;
  } else if (isPressed && !altStyle) {
    applyBgStyle = styles.buttonBackgroundPressed;
    applyFntStyle = styles.buttonText;
  } else if (isPressed && altStyle) {
    applyBgStyle = styles.buttonBackgroundAlt;
    applyFntStyle = styles.buttonTextAlt;
  } else if (!isPressed && altStyle) {
    applyBgStyle = styles.buttonBackgroundPressedAlt;
    applyFntStyle = styles.buttonTextAlt;
  }

  return (
    <TouchableWithoutFeedback
      onPress={buttonAction}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={applyBgStyle}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={moderateScale(22)}
            color={iconColour}
            onPress={buttonAction}
          />
        )}
        {buttonText && <Text style={applyFntStyle}>{buttonText}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonBackground: {
    borderRadius: moderateScale(55),
    backgroundColor: "#538dbd",
    width: scale(55),
    height: moderateScale(50),
    padding: moderateScale(5),
    marginRight: moderateScale(10),
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
  buttonBackgroundPressed: {
    borderRadius: moderateScale(40),
    backgroundColor: "#6498c3",
    width: scale(55),
    height: moderateScale(50),
    padding: moderateScale(5),
    marginRight: moderateScale(20),
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
  buttonBackgroundAlt: {
    borderRadius: moderateScale(40),
    backgroundColor: "pink",
    width: scale(55),
    height: moderateScale(50),
    padding: moderateScale(5),
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
    width: scale(55),
    height: moderateScale(50),
    padding: moderateScale(5),
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
    color: "white",
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(12),
  },
  buttonTextAlt: {
    color: "black",
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(12),
  },
});
