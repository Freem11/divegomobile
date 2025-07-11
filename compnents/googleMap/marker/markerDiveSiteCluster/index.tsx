import React from "react";
import { Marker } from "react-native-maps";

import icon from "../../../png/mapIcons/AnchorCluster.png";
import { useMapStore } from "../../useMapStore";
import { Coordinates } from "../../../../entities/coordinates";

type MarkerDiveSiteClusterProps = {
  coordinate: Coordinates;
  getExpansionZoom: () => number;
};

export function MarkerDiveSiteCluster(props: MarkerDiveSiteClusterProps) {
  const mapRef = useMapStore((state) => state.mapRef);

  return (
    <Marker
      image={icon}
      coordinate={props.coordinate}
      onPress={() => {
        const expansionZoom = Math.min(props.getExpansionZoom(), 16);
        console.log({ expansionZoom });
        mapRef.animateCamera({
          center: props.coordinate,
          zoom: expansionZoom,
        });
      }}
    >
    </Marker>
  );
}
