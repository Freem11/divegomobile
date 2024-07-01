import React from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function CompletnessIndicator(props) {
  const { indicatorState } = props

  return (
    <View
    style={
      indicatorState
        ? styles.ImageUploadIndicatorGreen
        : styles.ImageUploadIndicatorRed
    }
  ></View>
  );
}

const styles = StyleSheet.create({
  ImageUploadIndicatorGreen: {
    backgroundColor: "lightgreen",
    height: moderateScale(15),
    width: moderateScale(15),
    borderRadius: moderateScale(15),
    marginLeft: moderateScale(20),
    marginTop: moderateScale(30),
  },
  ImageUploadIndicatorRed: {
    backgroundColor: "red",
    height: moderateScale(15),
    width: moderateScale(15),
    borderRadius: moderateScale(15),
    marginLeft: moderateScale(20),
    marginTop: moderateScale(30),
  },
});
