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
import { getHeatPoints } from "../../supabaseCalls/heatPointSupabaseCalls";
import { HeatPoint } from "../../entities/heatPoint";

export default function GoogleMap() {
  const mapAction = useMapStore((state) => state.actions);
  
  const camera = useMapStore((state) => state.camera);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapConfig = useMapStore((state) => state.mapConfig);


  const [diveSites, setDiveSites] = useState<DiveSiteBasic[] | null>(null);
  const [diveShops, setDiveShops] = useState<DiveShop[] | null>(null);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[] | null>(null);

  const handleOnLoad = async (map: MapView) => {
    mapAction.setMapRef(map);
    const camera = await map.getCamera();
    // mapAction.setCamera(camera);
    console.log("loaded", { map: !!map });
  };

  const handleBoundsChange = debounce(async () => {
    if (!mapRef) {
      return;
    }

    const boundaries = await mapRef.getMapBoundaries();
    const bubble = GPSBubble.createFromBoundaries(boundaries);
    mapAction.setGpsBubble(bubble);

    const [diveSites, diveShops, heatPoints] = await Promise.all([
      GPSBubble.getItemsInGpsBubble(getDiveSitesBasic, bubble),
      GPSBubble.getItemsInGpsBubble(getDiveShops, bubble),
      GPSBubble.getItemsInGpsBubble(getHeatPoints, bubble),
    ]);
    setDiveShops(diveShops);
    setDiveSites(diveSites);
    setHeatPoints(heatPoints);
  }, 50);

  return (
    <GoogleMapView
      mapConfig={mapConfig}
      center={camera?.center}
      // tempMarker={tempMarker}
      onLoad={handleOnLoad}
      handleBoundsChange={handleBoundsChange}
      heatPoints={heatPoints}
      diveSites={diveSites}
      diveShops={diveShops}
    />
  );
}