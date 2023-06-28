import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { scale } from 'react-native-size-matters';

let heightVal
export default function DataBar(props) {

  const { moddedVal } = props;

  heightVal = moddedVal
  return (
    <View style={[styles.container, {height: moddedVal + "%"}]} pointerEvents={'none'}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "baseline",
    backgroundColor: "#e7ecef",
    zIndex: 2,
    borderTopRightRadius: scale(5),
    borderTopLeftRadius: scale(35),
    marginLeft: 1,
    marginRight: 1,
    width: 13,
  },
});
