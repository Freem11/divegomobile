import React, { useContext } from "react";
import { Marker } from "react-native-maps";
// import image from "../../png/mapIcons/DiveCentre60x60.png";
import image from "../../../png/mapIcons/DiveCentre60x60.png";

type MarkerDiveShopProps = {
  id: number;
  latitude: number;
  longitude: number;
};

export function MarkerDiveShop(props: MarkerDiveShopProps) {
  // const { modalShow } = useContext(ModalContext);

  return (
    <Marker
      coordinate={{ latitude: props.latitude, longitude: props.longitude }}
      image={image}
      // onPress={() => setupShopModal(cluster.properties.siteID)}
    ></Marker>
  );
}
