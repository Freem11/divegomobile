import React from "react";
import { Marker } from "react-native-maps";
import icon from "../../../png/mapIcons/AnchorBlue.png";
import { Coordinates } from "../../../../entities/coordinates";
import { useActiveScreenStore } from "../../../../store/ussActiveScreenStore";

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const sitesArray = [];
  return (
    <Marker
      image={icon}
      coordinate={props.coordinate}
      onPress={() => setActiveScreen("DiveSiteScreen", {id: props.id})}
    ></Marker>
  );
}
