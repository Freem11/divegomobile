import React from "react";
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import {
  MaterialIcons,
  FontAwesome6,
  MaterialCommunityIcons,
  Entypo,
  Ionicons,
  Fontisto
} from "@expo/vector-icons";
import { activeFonts, colors } from "../../styles";

export default function TextInputField(props) {
  const {
    icon,
    placeHolderText,
    secure,
    setSecureTextEntry,
    inputValue,
    onChangeText,
    vectorIcon,
    handleClear,
    animal,
    style = {},
    keyboardConfig,
  } = props;

  let keyboardValue;

  if (keyboardConfig === "number-pad") {
    if (Platform.OS === "ios") {
      keyboardValue = "numbers-and-punctuation";
    }
  }

  if (!keyboardConfig) {
    keyboardValue = "default";
  }

  return (
    <View style={styles.container} {...style}>
      {!vectorIcon ? (
        <MaterialIcons name={icon} size={moderateScale(24)} color="darkgrey" />
      ) : null}
      {vectorIcon === "MaterialCommunityIcons" ? (
        <MaterialCommunityIcons
          name={icon}
          size={moderateScale(24)}
          color="darkgrey"
        />
      ) : null}
      {vectorIcon === "Entypo" ? (
        <Entypo name={icon} size={moderateScale(24)} color="darkgrey" />
      ) : null}
      {vectorIcon === "Ionicons" ? (
        <Ionicons name={icon} size={moderateScale(24)} color="darkgrey" />
      ) : null}

      <TextInput
        style={styles.input}
        value={inputValue}
        placeholder={placeHolderText}
        placeholderTextColor="darkgrey"
        color={colors.themeBlack}
        fontSize={moderateScale(18)}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        keyboardType={keyboardValue}
        autoCapitalize="none"
      />
      {placeHolderText === "Password" ? (
        <TouchableOpacity onPress={() => setSecureTextEntry(!secure)}>
          <FontAwesome6
            name={secure ? "eye-slash" : "eye"}
            size={moderateScale(22)}
            color="darkgrey"
            style={{ marginLeft: moderateScale(1) }}
          />
        </TouchableOpacity>
      ) : null}
      {(placeHolderText === "Sea Life Encountered" ||
        placeHolderText === "Search by Dive Site name or Location") &&
        animal?.length > 1 ? (
        <MaterialIcons
          name="highlight-remove"
          size={moderateScale(22)}
          color="darkgrey"
          onPress={() => handleClear()}
        />
      ) : (
        <View style={{ width: moderateScale(22) }}></View>
      )}

      {placeHolderText === "Blow some bubbles" ? (
        <Fontisto
          name="snorkel"
          size={moderateScale(22)}
          color="darkgrey"
          onPress={() => handleClear()}
        />
      ) : (
        <View style={{ width: moderateScale(22) }}></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "darkgrey",
    borderBottomWidth: moderateScale(2),
    alignItems: "center",
    backgroundColor: colors.themeWhite,
    borderRadius: moderateScale(5),
  },
  input: {
    width: "83%",
    height: moderateScale(30),
    fontFamily: activeFonts.Regular,
  },
});
