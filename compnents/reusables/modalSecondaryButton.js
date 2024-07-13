import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback ,Text } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModalSecondaryButton(props) {
  const { buttonAction, icon, buttonText, altStyle } = props;
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
      <View
        style={applyBgStyle}
      >
        {buttonText ? (
          <Text style={applyFntStyle}>{buttonText}</Text>
        ) : (
          <MaterialIcons
            name={icon}
            size={moderateScale(24)}
            color="gold"
            onPress={buttonAction}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonBackground: {
    borderRadius: moderateScale(40),
    backgroundColor: "#538dbd",
    width: moderateScale(65),
    height: moderateScale(35),
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
  buttonBackgroundPressed: {
    borderRadius: moderateScale(40),
    backgroundColor: "#6498c3",
    width: moderateScale(65),
    height: moderateScale(35),
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
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(17),
  },
  buttonTextAlt: {
    color: "black",
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(17),
  },
});
