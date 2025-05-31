import React, { useState } from "react";

import { debounce } from "../reusables/_helpers/debounce";
import GoogleMapView from "./view";
import MapView from "react-native-maps";
import { useMapStore } from "./useMapStore";
import { GPSBubble } from "../../entities/GPSBubble";
import { getDiveSitesBasic } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { getDiveShops } from "../../supabaseCalls/shopsSupabaseCalls";
import { DiveSiteBasic } from "../../entities/diveSite";
import { DiveShop } from "../../entities/diveShop";

export default function GoogleMap() {
  const setGpsBubble = useMapStore((state) => state.setGpsBubble);
  const camera = useMapStore((state) => state.camera);
  const setCamera = useMapStore((state) => state.setCamera);
  const setMapRef = useMapStore((state) => state.setMapRef);
  const mapRef = useMapStore((state) => state.mapRef);

  const [diveSites, setDiveSites] = useState<DiveSiteBasic[] | null>(null);
  const [diveShops, setDiveShops] = useState<DiveShop[] | null>(null);

  const handleOnLoad = async (map: MapView) => {
    setMapRef(map);
    const camera = await map.getCamera();
    setCamera(camera);
    console.log("loaded", { map: !!map });
  };

  const handleBoundsChange = debounce(async () => {
    if (!mapRef) {
      return;
    }

    const boundaries = await mapRef.getMapBoundaries();
    const bubble = GPSBubble.createFromBoundaries(boundaries);
    setGpsBubble(bubble);

    const [diveSites, diveShops] = await Promise.all([
      GPSBubble.getItemsInGpsBubble(getDiveSitesBasic, bubble),
      GPSBubble.getItemsInGpsBubble(getDiveShops, bubble),
    ]);
    setDiveShops(diveShops);
    setDiveSites(diveSites);
  }, 50);

  return (
    <GoogleMapView
      mapConfig={0}
      center={camera?.center}
      // tempMarker={tempMarker}
      onLoad={handleOnLoad}
      handleBoundsChange={handleBoundsChange}
      // heatPoints={photoContext.heatPoints}
      diveSites={diveSites}
      diveShops={diveShops}
    />
  );
}