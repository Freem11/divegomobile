import React from "react";
import { Marker } from "react-native-maps";
import icon from "../../../png/mapIcons/AnchorCluster.png";

type MarkerDiveSiteClusterProps = {
  latitude: number;
  longitude: number;
};

export function MarkerDiveSiteCluster(props: MarkerDiveSiteClusterProps) {
  return (
    <Marker
      image={icon}
      coordinate={{ latitude: props.latitude, longitude: props.longitude }}
      // onClick={() => {
      //   const expansionZoom = Math.min(props.expansionZoom, 14);
      //   if (mapRef) {
      //     mapRef.setZoom(expansionZoom);
      //     mapRef.panTo(props.position);
      //   }
      // }}
    ></Marker>
  );
}
