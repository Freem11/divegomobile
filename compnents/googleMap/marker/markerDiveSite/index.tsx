import React, { useContext, useEffect, useState, memo } from "react";
import { Marker } from "react-native-maps";

import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useMapStore } from "../../useMapStore";
import { useAppNavigation } from "../../../mapPage/types";
import { MapConfigurations } from "../../types";
import { Coordinates } from "../../entities/coordinates";

const ANCHOR_WHITE = require("../../../png/mapIcons/AnchorWhite.png");
const ANCHOR_GOlD = require("../../../png/mapIcons/AnchorGold.png");

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
  isSelected: boolean; // Add this prop
};

export const MarkerDiveSite = memo((props: MarkerDiveSiteProps) => {
  const navigation = useAppNavigation();
  const mapConfig = useMapStore((state) => state.mapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);

  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => setTracksViewChanges(false), 600);
    return () => clearTimeout(timer);
  }, [props.isSelected, mapConfig]); // Use prop here

  function handlePress() {
    if (mapConfig !== MapConfigurations.TripBuild) {
      navigation.navigate("DiveSiteNavigator", { id: props.id });
    } else {
      if (props.isSelected) {
        setSitesArray((prev: number[]) => prev.filter(id => id !== props.id));
      } else {
        setSitesArray((prev: number[]) => [...prev, props.id]);
      }
    }
  }

  return (
    <Marker
      coordinate={props.coordinate}
      onPress={handlePress}
      // Toggle image based on prop
      image={props.isSelected ? ANCHOR_GOlD : ANCHOR_WHITE}
      tracksViewChanges={tracksViewChanges}
      stopPropagation={true}
      zIndex={props.isSelected ? 100 : 2}
      opacity={mapConfig === MapConfigurations.TripBuild && !props.isSelected ? 0.6 : 1}
      pointerEvents="auto"
    />
  );
});