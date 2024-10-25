import React from "react";
import { StyleSheet, View, Text, Platform, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { activeFonts } from "../styles";

const windowWidth = Dimensions.get("window").width;

export default function AxisBar() {
  return (
    <View style={styles.container} pointerEvents={'none'}>
      <View style={styles.axisLine} pointerEvents={'none'}></View>
      <View style={styles.months} pointerEvents={'none'}>
      <Text style={styles.letter}>J</Text>
      <Text style={styles.letter}>F</Text>
      <Text style={styles.letter}>M</Text>
      <Text style={styles.letter}>A</Text>
      <Text style={styles.letter}>M</Text>
      <Text style={styles.letter}>J</Text>
      <Text style={styles.letter}>J</Text>
      <Text style={styles.letter}>A</Text>
      <Text style={styles.letter}>S</Text>
      <Text style={styles.letter}>O</Text>
      <Text style={styles.letter}>N</Text>
      <Text style={styles.letter}>D</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  axisLine: {
    position: "absolute",
    bottom: windowWidth > 600 ? scale(11) : Platform.OS === "ios" ? scale(24) : scale(26),
    alignSelf: "center",
    height: scale(2),
    backgroundColor: "#538bdb",
    width: "90%",
    zIndex: 2,
    marginRight: -5
  },
  months: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginLeft: scale(10),
    marginBottom : windowWidth > 600 ? -10 : 10,
    color: "white",
    backgroundColor: "black",
    opacity: 0.7,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  letter: {
    marginLeft: 1,
    marginRight: 1,
    width: scale(13),
    color: "white",
    fontFamily: activeFonts.Thin,
    opacity: 1   ,
    fontSize: scale(13)
  }
});
