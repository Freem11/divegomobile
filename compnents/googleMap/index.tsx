import React, { useContext, useEffect, useState } from "react";
import MapView from "react-native-maps";

import { debounce } from "../reusables/_helpers/debounce";
import { GPSBubble } from "../../entities/GPSBubble";
import { getDiveSitesBasic } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { getDiveShops } from "../../supabaseCalls/shopsSupabaseCalls";
import { DiveSiteBasic } from "../../entities/diveSite";
import { DiveShop } from "../../entities/diveShop";
import { getHeatPoints } from "../../supabaseCalls/heatPointSupabaseCalls";
import { HeatPoint } from "../../entities/heatPoint";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";

import { useMapStore } from "./useMapStore";
import GoogleMapView from "./view";

export default function GoogleMap() {
  const mapAction = useMapStore((state) => state.actions);

  const camera = useMapStore((state) => state.camera);
  const mapRef = useMapStore((state) => state.mapRef);
  const bubble = useMapStore((state) => state.gpsBubble);
  const mapConfig = useMapStore((state) => state.mapConfig);

  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const [diveSites, setDiveSites] = useState<DiveSiteBasic[] | null>(null);
  const [diveShops, setDiveShops] = useState<DiveShop[] | null>(null);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[] | null>(null);

  const handleOnLoad = async(map: MapView) => {
    mapAction.setMapRef(map);
  };

  const handleOnMapReady = () => {
    handleBoundsChange();
  };

  useEffect(() => {
    (async() => {
      const heatPoints = await GPSBubble.getItemsInGpsBubble(getHeatPoints, bubble , { animal: animalMultiSelection });
      setHeatPoints(heatPoints);
    })();
  }, [animalMultiSelection, bubble]);

  const handleBoundsChange = debounce(async() => {
    if (!mapRef) {
      return;
    }

    const boundaries = await mapRef.getMapBoundaries();
    const bubble = GPSBubble.createFromBoundaries(boundaries);
    mapAction.setGpsBubble(bubble);

    const [diveSites, diveShops] = await Promise.all([
      GPSBubble.getItemsInGpsBubble(getDiveSitesBasic, bubble),
      GPSBubble.getItemsInGpsBubble(getDiveShops, bubble, ""),
    ]);
    setDiveShops(diveShops);
    setDiveSites(diveSites);
  }, 50);

  return (
    <GoogleMapView
      mapConfig={mapConfig}
      center={camera?.center}
      // tempMarker={tempMarker}
      onLoad={handleOnLoad}
      handleBoundsChange={handleBoundsChange}
      handleOnMapReady={handleOnMapReady}
      heatPoints={heatPoints}
      diveSites={diveSites}
      diveShops={diveShops}
    />
  );
}