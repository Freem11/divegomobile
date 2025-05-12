import React, { useContext, useState } from "react";
import { Marker } from "react-native-maps";
import { useMapStore } from "../../useMapStore";
import { Coordinates } from "../../../../entities/coordinates";
// import { Marker } from '@react-google-maps/api';
// import icon from '../../../../images/Manta32.png';
// import { MapContext } from '../../mapContext';

type MarkerDraggableProps = {
  coordinates: Coordinates;
};

export function MarkerDraggable(props: MarkerDraggableProps) {
  const setDraggablePoint = useMapStore((state) => state.setDraggablePoint);
  const camera = useMapStore((state) => state.camera);

  // const { mapRef, setDraggablePoint } = useContext(MapContext);
  // const initialPosition = props.position || mapRef?.getCenter();
  // const [pin, setPin] = useState<google.maps.Marker | null>(null);

  // const onLoad = (marker: google.maps.Marker) => {
  //   setPin(marker);
  //   const position = marker.getPosition();
  //   if (position) {
  //     setDraggablePoint({ lat: position.lat(), lng: position.lng() });
  //   }
  // };

  const onDragEnd = (e) => {
    setDraggablePoint({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  return (
    <Marker
      draggable={true}
      onDragEnd={onDragEnd}
      coordinate={{
        latitude: camera.center.latitude,
        longitude: camera.center.longitude,
      }}
    ></Marker>
  );
}
