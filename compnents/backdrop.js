import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import WavyHeader from "./wavyHeader";

export default function BackDrop() {
  return (
    <View style={styles.container}>
      <WavyHeader customStyles={styles.svgCurve} />
      {/* <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Custom Header</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    marginTop: 50,
    marginHorizontal: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 35,
  },
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
});
