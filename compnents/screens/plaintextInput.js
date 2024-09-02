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
      <TextInput
        style={[styles.input , {backgroundColor: isEditModeOn ? "darkgrey" : colors.themeWhite}]}
        value={content}
        color={colors.themeBlack}
        editable={isEditModeOn ? true: false}
        fontSize={moderateScale(18)}
        onChangeText={onChangeText}
        multiline={true}
      ></TextInput>
      {isEditModeOn ? (
        <FontAwesome6
          name="check"
          size={moderateScale(16)}
          color="green"
          onPress={() => setIsEditModeOn(false)}
          style={{marginLeft: moderateScale(5)}}
        />
      ) : (
        <FontAwesome6
          name="pencil"
          size={moderateScale(16)}
          color="darkgrey"
          onPress={() => setIsEditModeOn(true)}
          style={{marginLeft: moderateScale(5)}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: "10%",
  },
  input: {
    minWidth: moderateScale(40),
    maxWidth: '90%',
    flexWrap: 'wrap',
    height:'auto',
    fontFamily: activeFonts.BoldItalic
  },
});
