import React from "react";
import { Marker } from "react-native-maps";
// import DiveSite from "../../../newModals/diveSite";
// import image from "../../../png/mapIcons/AnchorBlue1.png";
import image from "../../../png/mapIcons/AnchorBlue.png";

type MarkerDiveSiteProps = {
  id: number;
  latitude: number;
  longitude: number;
};

export function MarkerDiveSite(props: MarkerDiveSiteProps) {
  // const { modalShow } = useContext(ModalContext);
  // const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  // const { mapConfig } = useContext(MapContext);

  // function handleClick() {
  //   if (mapConfig !== 3) {
  //     modalShow(DiveSite, {
  //       id: props.id,
  //       size: "large",
  //     });
  //   } else {
  //     if (sitesArray.includes(props.id)) {
  //       setSitesArray((prev) => prev.filter((id) => id !== props.id));
  //     } else {
  //       setSitesArray((prev) => [...prev, props.id]);
  //     }
  //   }
  // }
  console.log(props);
  return (
    <Marker
      key={`${props.id}-site`}
      image={image}
      coordinate={{ latitude: props.latitude, longitude: props.longitude }}
      // onClick={handleClick}
    ></Marker>
  );
}
