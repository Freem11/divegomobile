import React, { useContext } from "react";
import { Marker } from "react-native-maps";
import image from "../../../png/mapIcons/DiveCentre60x60.png";
import { Coordinates } from "../../../../entities/coordinates";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";

type MarkerDiveShopProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveShop(props: MarkerDiveShopProps) {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);

  const handleScreen = () => {
    setActiveScreen("DiveShopScreen", {id: props.id})
    setLevelOneScreen(true)
  }

  return (
    <Marker
      coordinate={props.coordinate}
      image={image}
      onPress={handleScreen}
    ></Marker>
  );
}
