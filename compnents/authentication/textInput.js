import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { MaterialIcons, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { activeFonts, colors } from "../styles";

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
    animal
  } = props;

  return (
    <View style={styles.container}>
{!vectorIcon ? <MaterialIcons name={icon} size={moderateScale(24)} color="darkgrey" /> : null}
{vectorIcon === 'MaterialCommunityIcons' ? <MaterialCommunityIcons name={icon} size={moderateScale(24)} color="darkgrey" /> : null}

      <TextInput
        style={styles.input}
        value={inputValue}
        placeholder={placeHolderText}
        placeholderTextColor="darkgrey"
        color={colors.themeBlack}
        fontSize={moderateScale(18)}
        onChangeText={onChangeText}
        secureTextEntry={secure}
      ></TextInput>
      {placeHolderText === "Password" ? (
        secure ? (
          <FontAwesome6
            name="eye-slash"
            size={moderateScale(22)}
            color="darkgrey"
            onPress={() => setSecureTextEntry(false)}
          />
        ) : (
          <FontAwesome6
            style={{ marginLeft: moderateScale(1) }}
            name="eye"
            size={moderateScale(22)}
            color="darkgrey"
            onPress={() => setSecureTextEntry(true)}
          />
        )
      ) : null}
    {placeHolderText === "Sea Life Encountered" && animal.length > 1 ? (
             <MaterialIcons
             name="highlight-remove"
             size={moderateScale(22)}
             color="darkgrey"
             onPress={() => handleClear()}
           />
    ): <View style={{width: moderateScale(22)}}></View>}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "darkgrey",
    borderBottomWidth: moderateScale(2),
    alignItems: 'center',
    backgroundColor: colors.themeWhite
  },
  input: {
    width: "83%",
    height: moderateScale(30),
    fontFamily: activeFonts.Regular,
  },
});
