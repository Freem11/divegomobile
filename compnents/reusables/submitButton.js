import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function SubmitButton(props) {
  const { buttonAction, label } =
    props;
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.topBorder}>
    <TouchableWithoutFeedback
      onPress={buttonAction}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View
        style={isPressed ? styles.buttonBackgroundPressed : styles.buttonBackground}
      >
        <Text style={styles.buttonText}>
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBackground: {
    marginTop: moderateScale(6),
    marginBottom: moderateScale(-4),
    fontFamily: "PatrickHand_400Regular",
    borderColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: 'center',
    textAlign: "center",
  },
  buttonBackgroundPressed: {
    backgroundColor: "#6498c3",
    marginTop: moderateScale(6),
    marginBottom: moderateScale(-4),
    fontFamily: "PatrickHand_400Regular",
    borderColor: "transparent",
    width: "100%",
    justifyContent: "center",
    alignItems: 'center',
    textAlign: "center",
  },
  buttonText: {
    color: "gold",
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(26),
  },
  topBorder: {
    position: "absolute",
    marginBottom: "0%",
    borderTopWidth: 0.5,
    width: "85%",
    borderTopColor: "darkgrey",
    borderBottomColor: "transparent",
    bottom: "2%",
  },
});
