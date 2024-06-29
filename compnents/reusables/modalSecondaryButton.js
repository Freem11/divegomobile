import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModalSecondaryButton(props) {
  const { buttonAction, icon } = props;
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={buttonAction}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={isPressed ? styles.buttonBackgroundPressed : styles.buttonBackground}>
        <MaterialIcons name={icon} size={moderateScale(24)} color="gold" />
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
    marginLeft: "30%",
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
    marginLeft: "30%",
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

});
