import React, { useState, useEffect, memo } from "react";
import { Marker } from "react-native-maps";

interface ClusterProps {
  coordinate: { latitude: number; longitude: number };
  pointCount: number;
  onPress: () => void;
}

const ANCHOR_BLUE = require("../../../png/mapIcons/AnchorBlue.png");

const MarkerDiveSiteCluster = memo((props: ClusterProps) => {
  const [tracksView, setTracksView] = useState(false);

  useEffect(() => {
    setTracksView(true);
    const timer = setTimeout(() => setTracksView(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Never return null — AIRGoogleMap insertReactSubview throws NSInvalidArgumentException for nil
  const coord = props.coordinate && typeof props.coordinate.latitude === "number" && typeof props.coordinate.longitude === "number"
    ? props.coordinate
    : { latitude: 0, longitude: 0 };

  return (
    <Marker
      coordinate={coord}
      image={ANCHOR_BLUE}
      tracksViewChanges={tracksView}
      onPress={props.onPress}
      stopPropagation={true}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={5}
      opacity={coord === props.coordinate ? 1 : 0}
      pointerEvents={coord === props.coordinate ? "auto" : "none"}
    />
  );
});

export default MarkerDiveSiteCluster;