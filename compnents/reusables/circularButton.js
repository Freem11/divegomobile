import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { activeFonts, colors, fontSizes } from "../styles";

export default function CircularButton(props) {
  const { buttonAction, icon } = props;
  const [isPressed, setIsPressed] = useState(true);

  useEffect(() => {
    setIsPressed(!isPressed)
  },[buttonAction])

  return (
    <View
    style={
      isPressed
        ? styles.buttonwrapperPressed
        : styles.buttonwrapper
    }
  >
      <MaterialCommunityIcons
        name={icon}
        onPress={buttonAction}
        color={colors.themeWhite }
        size={moderateScale(30)}
      />
  </View>
  );
}

const styles = StyleSheet.create({
  buttonwrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    height: moderateScale(39),
    width: moderateScale(39),
    backgroundColor: colors.primaryBlue,
    borderWidth: moderateScale(0.2),
    borderColor : colors.themeWhite,
    zIndex: 1,
  },
  buttonwrapperPressed: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    height: moderateScale(39),
    width: moderateScale(39),
    backgroundColor: colors.primaryBlue,
    borderWidth: moderateScale(0.2),
    borderColor : colors.themeWhite,
    zIndex: 1,
  },
});
