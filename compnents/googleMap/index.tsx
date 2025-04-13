import React, { useContext, useEffect, useMemo, useState } from "react";

import { MapContext } from "./mapContext";
import { PhotoContext } from "../contexts/photoContext";
import { DiveSiteContext } from "../contexts/diveSiteContext";
import { DiveShopContext } from "../contexts/diveShopContext";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { debounce } from "../reusables/_helpers/debounce";
import GoogleMapView from "./view";
import MapView from "react-native-maps";
import { Text, View } from "react-native";
import { useMapStore } from "./useMapStore";

export default function GoogleMap() {
  // const mapContext = useContext(MapContext);
  const updateBoundaries = useMapStore((state) => state.updateBoundaries);
  const setMap = useMapStore((state) => state.setMap);
  // const [tempMarker, setTempMarker] = useState<{ lat: number, lng: number } | null>(null);
  // const { sitesArray } = useContext(SitesArrayContext);

  // const diveSiteContext = useContext(DiveSiteContext);
  // const diveShopContext = useContext(DiveShopContext);
  // const photoContext = useContext(PhotoContext);

  // const center = useMemo(() => ({
  //   lat: mapContext.initialPoint[0],
  //   lng: mapContext.initialPoint[1],
  // }), []);

  const handleOnLoad = (map: MapView) => {
    setMap(map);
    console.log("loaded", { map: !!map });
  };

  const handleBoundsChange = debounce(async () => {
    updateBoundaries();
  }, 500);

  // useEffect(() => {
  //   if (mapContext.mapRef) {
  //     if (diveSiteContext.selectedDiveSite && !diveSiteContext.selectedDiveSite.lat) {
  //       setTempMarker({
  //         lat: diveSiteContext.selectedDiveSite.lat,
  //         lng: diveSiteContext.selectedDiveSite.lng,
  //       });
  //     }
  //   }

  //   setTimeout(() => {
  //     setTempMarker(null);
  //   }, 2000);
  // }, [diveSiteContext.selectedDiveSite]);

  return (
    <GoogleMapView
      // mapConfig={mapContext.mapConfig}
      // center={center}
      // tempMarker={tempMarker}
      onLoad={handleOnLoad}
      handleBoundsChange={handleBoundsChange}
      // heatPoints={photoContext.heatPoints}
      // diveSites={diveSiteContext.basicCollection.items}
      // diveShops={diveShopContext.collection.items}
    />
  );
}
