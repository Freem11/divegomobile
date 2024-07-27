import React from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function CompletnessIndicator(props) {
  const { indicatorState } = props

  const colorBasedIndicatorStyles = indicatorState
      ? styles.ImageUploadIndicatorGreen
      : styles.ImageUploadIndicatorRed

  return (
    <View
    style={
      [colorBasedIndicatorStyles, styles.ImageUploadIndicatorSizing]
    }
  ></View>
  );
}

const styles = StyleSheet.create({
  ImageUploadIndicatorGreen: {
    backgroundColor: "lightgreen",
  },
  ImageUploadIndicatorRed: {
    backgroundColor: "red",
  },
  ImageUploadIndicatorSizing: {
    height: moderateScale(15),
    width: moderateScale(15),
    borderRadius: moderateScale(15),
    marginLeft: moderateScale(20),
    marginTop: moderateScale(30),
  },
});
