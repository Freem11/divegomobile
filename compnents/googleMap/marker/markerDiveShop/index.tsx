import React, { useContext } from "react";
import { Marker } from "react-native-maps";
// import image from "../../png/mapIcons/DiveCentre60x60.png";
import image from "../../../png/mapIcons/DiveCentre60x60.png";
import { Coordinates } from "../../../../entities/coordinates";

type MarkerDiveShopProps = {
  id: number;
  coordinate: Coordinates;
};

export function MarkerDiveShop(props: MarkerDiveShopProps) {
  // const { modalShow } = useContext(ModalContext);

  return (
    <Marker
      coordinate={props.coordinate}
      image={image}
      // onPress={() => setupShopModal(cluster.properties.siteID)}
    ></Marker>
  );
}
