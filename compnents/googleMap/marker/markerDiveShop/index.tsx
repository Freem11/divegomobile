import React, { useEffect, useState, memo } from "react";
import { Marker } from "react-native-maps";

import { useAppNavigation } from "../../../mapPage/types";
import { Coordinates } from "../../entities/coordinates";

// Move require out to keep a static reference
const MASK_WHITE = require("../../../png/mapIcons/MaskWhite.png");

type MarkerDiveShopProps = {
  id: number;
  coordinate: Coordinates;
};

// Wrap in memo to prevent the "Zombie" effect and registry crashes
export const MarkerDiveShop = memo((props: MarkerDiveShopProps) => {
  const navigation = useAppNavigation();
  const [tracksChanges, setTracksChanges] = useState(true);

  const handleScreen = () => {
    navigation.navigate("DiveShopNavigator", { id: props.id });
  };

  // Lifecycle-based locking
  useEffect(() => {
    setTracksChanges(true);
    const timer = setTimeout(() => {
      setTracksChanges(false);
    }, 600); // 600ms is the sweet spot for Native UI thread registration
    return () => clearTimeout(timer);
  }, []); // Only runs on mount; handles the initial render perfectly

  return (
    <Marker
      // REMOVED internal key - provided by Parent .map() for stability
      coordinate={props.coordinate}
      onPress={handleScreen}
      image={MASK_WHITE}
      tracksViewChanges={tracksChanges}
      // prevents touch events from bubbling to clusters/map (prevents crash)
      stopPropagation={true}
      // Shops sit on top of standard dive sites but below selected anchors
      zIndex={75}
      anchor={{ x: 0.5, y: 0.5 }}
      // Fabric / New Arch stability
      pointerEvents="auto"
    />
  );
});