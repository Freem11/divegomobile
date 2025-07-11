import React, { useContext, useEffect, useState } from "react";
import { Marker } from "react-native-maps";
import { Image, StyleSheet, Text, View } from "react-native";

import { useMapStore } from "../../useMapStore";
import { Coordinates } from "../../../../entities/coordinates";
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
})

type MarkerDraggableProps = {
};

export function MarkerDraggable(props: MarkerDraggableProps) {

  return (

    <View style={styles.markerFixed}>
      <Image style={styles.marker} source={icon} />
    </View>
  );
}

