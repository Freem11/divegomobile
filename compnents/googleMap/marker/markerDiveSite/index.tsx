import React from "react";
import { Marker } from "react-native-maps";
import icon from "../../../png/mapIcons/AnchorBlue.png";

type MarkerDiveSiteProps = {
  id: number;
  latitude: number;
  longitude: number;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  const sitesArray = [];
  return (
    <Marker
      image={icon}
      coordinate={{ latitude: props.latitude, longitude: props.longitude }}
      // onClick={handleClick}
    ></Marker>
  );
}
