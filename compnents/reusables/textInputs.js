import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { moderateScale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";

export default function InputField(props) {
  const {validationItem, placeHolderText, inputValue, keyboardType, onChangeText, secure, ptEvents} = props

  let multiLine = true
  if(secure){
    multiLine= false
  }

  let pointerEventsAllows = true
  if(ptEvents){
    pointerEventsAllows= false
  }
  return (
    <InsetShadow
        containerStyle={{
          backgroundColor: validationItem
            ? "pink"
            : "#538bdb",
          borderRadius: moderateScale(25),
          height: moderateScale(40),
          width: moderateScale(200),
          alignItems: "center",
          justifyContent: "center",
        }}
        elevation={20}
        shadowRadius={15}
        shadowOpacity={0.3}
      >
        <TextInput
          style={
            validationItem ? styles.inputRed : styles.input
          }
          value={inputValue}
          placeholder={placeHolderText}
          placeholderTextColor="lightgrey"
          keyboardType={keyboardType}
          color={'validationItem ? "#00171f" : "lightgrey"'}
          fontSize={moderateScale(18)}
          multiline={multiLine}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          editable={pointerEventsAllows}
        ></TextInput>
      </InsetShadow>
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    alignSelf: "center",
    textAlign: "center",
    overflow: "hidden",
    width: '100%'
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    alignSelf: "center",
    textAlign: "center",
    overflow: "hidden",
    width: '100%'
  },
});
