import React, { useContext, useEffect, useState } from "react";
import { Marker } from "react-native-maps";
import { useMapStore } from "../../useMapStore";
import { Coordinates } from "../../../../entities/coordinates";
import icon from "../../../png/mapIcons/Manta_60.png";

type MarkerDraggableProps = {
  coordinate: Coordinates;
};

export function MarkerDraggable(props: MarkerDraggableProps) {
  const setDraggablePoint = useMapStore((state) => state.setDraggablePoint);

  useEffect(() => {
    setDraggablePoint(props.coordinate);
    return () => {
      setDraggablePoint(null);
    };
  });

  // TODO marker has animated movement - no need this
  const onDragEnd = (e) => {
    setDraggablePoint({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });

    // console.log(e.nativeEvent.coordinate);
  };

  return (
    <Marker
      // image={icon}
      key={"drag"}
      draggable={true}
      onDragEnd={onDragEnd}
      coordinate={{
        latitude: props.coordinate.latitude,
        longitude: props.coordinate.longitude,
      }}
    ></Marker>
  );
}
