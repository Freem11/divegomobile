import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import WavyHeader from "./wavyHeader";
import { activeFonts, colors, primaryButton, primaryButtonAlt, buttonText, buttonTextAlt } from "./styles";
import { moderateScale } from "react-native-size-matters";

export default function BackDrop() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dive In. . .</Text>

      <View style={styles.loginButton}>
      <Text style={styles.loginText}>Log In</Text>
      </View>
      <View style={styles.registerButton}>
      <Text style={styles.registerText}>Create New Account</Text>
      </View>
      <WavyHeader customStyles={styles.svgCurve}></WavyHeader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    zIndex: 10,
    position: "absolute",
    top: "50%",
    left: "23%",
    fontSize: moderateScale(34),
    fontFamily: activeFonts.Bold,
    color: colors.themeBlack,
  },
  loginButton: [
    primaryButton,
    { zIndex: 10, position: "absolute", top: "62%" },
  ],
  registerButton: [
    primaryButtonAlt,
    { zIndex: 10, position: "absolute", top: "70%" },
  ],
  loginText: buttonText, 
  registerText: buttonTextAlt,
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
});
