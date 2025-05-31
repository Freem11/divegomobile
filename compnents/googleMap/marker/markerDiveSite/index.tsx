import React from "react";
import { Marker } from "react-native-maps";
import icon from "../../../png/mapIcons/AnchorBlue.png";
import { Coordinates } from "../../../../entities/coordinates";

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  const sitesArray = [];
  return (
    <Marker
      image={icon}
      coordinate={props.coordinate}
      // onClick={handleClick}
    ></Marker>
  );
}
