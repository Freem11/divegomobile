import React, { useContext, useEffect, useState, memo } from "react";
import { Marker } from "react-native-maps";

import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useMapStore } from "../../useMapStore";
import { useAppNavigation } from "../../../mapPage/types";
import { MapConfigurations } from "../../types";
import { Coordinates } from "../../entities/coordinates";

// Move require OUTSIDE to keep the reference stable
const ANCHOR_WHITE = require("../../../png/mapIcons/AnchorWhite.png");

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
};

// Wrap in memo to prevent unnecessary native re-draws
export const MarkerDiveSite = memo((props: MarkerDiveSiteProps) => {
  const navigation = useAppNavigation();
  const mapConfig = useMapStore((state) => state.mapConfig);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const isSelected = sitesArray.includes(props.id);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // WAKE UP / FREEZE LOGIC
  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => setTracksViewChanges(false), 600);
    return () => clearTimeout(timer);
  }, [isSelected, mapConfig]);

  function handlePress() {
    if (mapConfig !== MapConfigurations.TripBuild) {
      navigation.navigate("DiveSiteNavigator", { id: props.id });
    } else {
      if (isSelected) {
        setSitesArray((prev: number[]) => prev.filter(id => id !== props.id));
      } else {
        setSitesArray((prev: number[]) => [...prev, props.id]);
      }
    }
  }

  return (
    <Marker
      // REMOVED internal key - handled by the Parent's .map()
      coordinate={props.coordinate}
      onPress={handlePress}
      image={ANCHOR_WHITE}
      tracksViewChanges={tracksViewChanges}
      // prevents touch events from bubbling to clusters/map
      stopPropagation={true}
      zIndex={isSelected ? 100 : 2}
      // Visual cue for selection
      opacity={mapConfig === MapConfigurations.TripBuild && !isSelected ? 0.6 : 1}
      // Stability for Fabric
      pointerEvents="auto"
    />
  );
});