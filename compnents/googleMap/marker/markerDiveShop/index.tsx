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

const MarkerDiveShop = memo((props: MarkerDiveShopProps) => {
  const navigation = useAppNavigation();
  const [tracksChanges, setTracksChanges] = useState(true);

  const handleScreen = () => {
    navigation.navigate("DiveShopNavigator", { id: props.id });
  };

  useEffect(() => {
    setTracksChanges(true);
    const timer = setTimeout(() => {
      setTracksChanges(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      coordinate={props.coordinate}
      onPress={handleScreen}
      image={MASK_WHITE}
      tracksViewChanges={tracksChanges}
      stopPropagation={true}
      zIndex={75}
      anchor={{ x: 0.5, y: 0.5 }}
      pointerEvents="auto"
    />
  );
});

export default MarkerDiveShop;