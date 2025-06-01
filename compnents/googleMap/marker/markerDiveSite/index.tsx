import React, { useContext } from "react";
import { Marker } from "react-native-maps";
import icon from "../../../png/mapIcons/AnchorBlue.png";
import { Coordinates } from "../../../../entities/coordinates";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";

type MarkerDiveSiteProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const sitesArray = [];

  const handleScreen = () => {
    setActiveScreen("DiveSiteScreen", {id: props.id})
    setLevelOneScreen(true)
  }

  return (
    <Marker
      image={icon}
      coordinate={props.coordinate}
      onPress={handleScreen}
    ></Marker>
  );
}
