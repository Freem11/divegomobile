import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { scale } from "react-native-size-matters";

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
    bottom: 20,
    alignSelf: "center",
    height: 2,
    backgroundColor: "blue",
    width: "90%",
  },
  months: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginLeft: scale(11),
    marginBottom : 3,
  },
  letter: {
    marginLeft: 1,
    marginRight: 1,
    width: 13,
    color: "#001638",
    fontWeight: "bold",
    fontFamily: "BubblegumSans_400Regular",
  }
});
