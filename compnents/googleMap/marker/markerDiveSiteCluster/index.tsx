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

  if (!props.coordinate || !props.coordinate.latitude) {
    return null;
  }

  return (
    <Marker
      coordinate={props.coordinate}
      image={ANCHOR_BLUE}
      tracksViewChanges={tracksView}
      onPress={props.onPress}
      stopPropagation={true}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={5}
    />
  );
});

export default MarkerDiveSiteCluster;