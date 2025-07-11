import React, { useContext } from "react";
import { Marker } from "react-native-maps";

import icon from "../../../png/mapIcons/AnchorBlue.png";
import iconGold from "../../../png/mapIcons/AnchorGold.png";
import { Coordinates } from "../../../../entities/coordinates";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useMapStore } from "../../useMapStore";

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const mapConfig = useMapStore((state) => state.mapConfig);

  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const handleScreen = () => {
    setActiveScreen("DiveSiteScreen", {id: props.id})
    setLevelOneScreen(true)
  }

  function handlePress() {
    if (mapConfig !== 3) {
      handleScreen()
    } else {
      if (sitesArray.includes(props.id)) {
        setSitesArray(prev => prev.filter(id => id !== props.id));
      } else {
        setSitesArray(prev => [...prev, props.id]);
      }
    }
  }
  return (
    <Marker
      image={sitesArray.includes(props.id) ? iconGold : icon}
      coordinate={props.coordinate}
      onPress={handlePress}
    >
    </Marker>
  );
}
