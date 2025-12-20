import React from "react";
import { Image, StyleSheet, View } from "react-native";

import icon from "../../../png/mapIcons/Manta_60.png";

const styles = StyleSheet.create({
  markerFixed: {
    left: "50%",
    marginLeft: -20,
    marginTop: -48,
    position: "absolute",
    top: "50%"
  },
  marker: {
    height: 48,
    width: 48
  }
});

export function MarkerDraggable() {

  return (

    <View style={styles.markerFixed}>
      <Image style={styles.marker} source={icon} />
    </View>
  );
}

