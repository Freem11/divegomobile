import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { scale } from 'react-native-size-matters';

export default function Logo() {
  return (
    <View style={styles.container} pointerEvents={"none"}>
      <Text pointerEvents={"none"} style={{ fontFamily: "Caveat_400Regular", fontSize: scale(20) }}>DiveGo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    height: scale(53),
    borderTopRightRadius: scale(15),
    width: "20%",
    paddingRight: 10,
    paddingTop: -10,
    fontSize: "2rem"
  },
});
