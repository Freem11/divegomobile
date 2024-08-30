import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { activeFonts, colors } from "../styles";

export default function PlainTextInput(props) {
  const {
    content,
    isEditModeOn,
    setIsEditModeOn,
    onChangeText,
  } = props;

  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={moderateScale(24)} color="darkgrey" />
      <TextInput
        style={styles.input}
        value={content}
        color={"darkgrey"}
        fontSize={moderateScale(18)}
        onChangeText={onChangeText}
      ></TextInput>
      {isEditModeOn ? (
        <FontAwesome6
          name="check"
          size={moderateScale(22)}
          color="green"
          onPress={() => setIsEditModeOn(false)}
        />
      ) : (
        <FontAwesome6
          name="pencil"
          size={moderateScale(22)}
          color="darkgrey"
          onPress={() => setIsEditModeOn(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: moderateScale(30),
    fontFamily: activeFonts.Regular
  },
});
