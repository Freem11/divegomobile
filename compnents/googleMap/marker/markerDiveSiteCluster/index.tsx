import React, { useState, useEffect, memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";

interface ClusterProps {
  coordinate: { latitude: number; longitude: number };
  pointCount: number;
  onPress: () => void;
}

// 1. Wrap in memo to prevent coordinate flickering during zoom
export const MarkerDiveSiteCluster = memo((props: ClusterProps) => {
  const [tracksView, setTracksView] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  // 2. Static reference for the image
  const ANCHOR_BLUE = require("../../../png/mapIcons/AnchorBlue.png");

  useEffect(() => {
    setTracksView(true);
    const timer = setTimeout(() => { setTracksView(false); }, 600);
    return () => clearTimeout(timer);
  }, [props.pointCount]);

  const handlePress = () => {
    if (isLocked || !props.coordinate) return;
    setIsLocked(true);
    props.onPress();
    setTimeout(() => setIsLocked(false), 1000);
  };

  // 3. Safety Check: If coordinate is missing, don't render.
  // This prevents the "latitude of undefined" crash on the native side.
  if (!props.coordinate || !props.coordinate.latitude) {
    return null;
  }

  return (
    <Marker
      coordinate={props.coordinate}
      tracksViewChanges={tracksView}
      onPress={handlePress}
      stopPropagation={true}
      image={ANCHOR_BLUE}
      pointerEvents="auto"
    // 4. Ensure no children are passed if using the image prop
    />
  );
});