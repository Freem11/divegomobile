import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";

export default function CircularButton(props) {
  const { buttonAction, icon } = props;
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <View
    style={
      isPressed
        ? styles.buttonwrapperPressed
        : styles.buttonwrapper
    }
  >
    <TouchableWithoutFeedback
      onPress={buttonAction}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={{
        alignItems: "center",
        width: moderateScale(30),
        height: moderateScale(30),
      }}
    >
      <MaterialIcons
        name={icon}  //"anchor"
        color={isPressed ? "gold" : "white"}
        size={moderateScale(30)}
      />
    </TouchableWithoutFeedback>
  </View>
  );
}

const styles = StyleSheet.create({
  buttonwrapper: {
    position: "absolute",
    top: -moderateScale(30),
    right: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    height: moderateScale(39),
    width: moderateScale(39),
    backgroundColor: "#538bdb",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    elevation: 10,
  },
  buttonwrapperPressed: {
    position: "absolute",
    top: -moderateScale(30),
    right: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(50),
    height: moderateScale(39),
    width: moderateScale(39),
    backgroundColor: "white",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    elevation: 10,
  },
});
