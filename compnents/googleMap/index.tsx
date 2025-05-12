import React, { useContext, useEffect, useMemo, useState } from "react";

import { debounce } from "../reusables/_helpers/debounce";
import GoogleMapView from "./view";
import MapView from "react-native-maps";
import { useMapStore } from "./useMapStore";
import { GPSBubble } from "../../entities/GPSBubble";
import { getDiveSitesBasic } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { getDiveShops } from "../../supabaseCalls/shopsSupabaseCalls";
import { DiveSiteBasic } from "../../entities/diveSite";
import { DiveShop } from "../../entities/diveShop";
import useSupercluster from "use-supercluster";

export default function GoogleMap() {
  const setGpsBubble = useMapStore((state) => state.setGpsBubble);
  const camera = useMapStore((state) => state.camera);
  const setCamera = useMapStore((state) => state.setCamera);
  const setMapRef = useMapStore((state) => state.setMapRef);
  const mapRef = useMapStore((state) => state.mapRef);

  const [diveSites, setDiveSites] = useState<DiveSiteBasic[] | null>(null);
  const [diveShops, setDiveShops] = useState<DiveShop[] | null>(null);
  // const [tempMarker, setTempMarker] = useState<{ lat: number, lng: number } | null>(null);
  // const { sitesArray } = useContext(SitesArrayContext);

  // const photoContext = useContext(PhotoContext);

  // const center = useMemo(() => ({
  //   lat: mapContext.initialPoint[0],
  //   lng: mapContext.initialPoint[1],
  // }), []);

  const handleOnLoad = (map: MapView) => {
    setMapRef(map);
    console.log("loaded", { map: !!map });
  };

  const handleBoundsChange = debounce(async () => {
    if (!mapRef) {
      return;
    }

    const [camera, boundaries] = await Promise.all([mapRef.getCamera(), mapRef.getMapBoundaries()]);
    const bubble = GPSBubble.createFromBoundaries(boundaries);
    setGpsBubble(bubble);
    setCamera(camera);

    const [diveSites, diveShops] = await Promise.all([
      GPSBubble.getItemsInGpsBubble(getDiveSitesBasic, bubble),
      GPSBubble.getItemsInGpsBubble(getDiveShops, bubble),
    ]);
    setDiveShops(diveShops);
    setDiveSites(diveSites);
  }, 500);

  if (!camera) {
    return null;
  }

  return (
    <GoogleMapView
      mapConfig={1}
      center={camera.center}
      // tempMarker={tempMarker}
      onLoad={handleOnLoad}
      handleBoundsChange={handleBoundsChange}
      // heatPoints={photoContext.heatPoints}
      diveSites={diveSites}
      diveShops={diveShops}
    />
  );
}
