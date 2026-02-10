import React, { useContext, useEffect, useState } from "react";
import MapView from "react-native-maps";
import { Dimensions } from "react-native";

import { debounce } from "../reusables/_helpers/debounce";
import { GPSBubble } from "../../entities/GPSBubble";
import { getDiveSitesBasic } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { getDiveShops } from "../../supabaseCalls/shopsSupabaseCalls";
import { DiveSiteBasic } from "../../entities/diveSite";
import { DiveShop } from "../../entities/diveShop";
import { HeatPoint } from "../../entities/heatPoint";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { getCoordsForSeaLife } from "../../supabaseCalls/photoSupabaseCalls";

import { useMapStore } from "./useMapStore";
import GoogleMapView from "./view";

type GoogleMapProps = {
  species?: string;
  onBoundsChangeLocal?: (bounds: GPSBubble) => void;
};

export default function GoogleMap({ species, onBoundsChangeLocal }: GoogleMapProps) {
  const { width: mapPixelWidth } = Dimensions.get("window");
  const TILE_SIZE = 256;
  const [zoomLevel, setZoomLevel] = useState(1);
  const mapAction = useMapStore((state) => state.actions);

  const camera = useMapStore((state) => state.camera);
  const mapRegion = useMapStore((state) => state.mapRegion);
  const mapConfig = useMapStore((state) => state.mapConfig);

  // We use a local ref for the Map instance to distinguish between Main and Mini
  const [localMapRef, setLocalMapRef] = useState<MapView | null>(null);

  const [diveSites, setDiveSites] = useState<DiveSiteBasic[] | null>(null);
  const [diveShops, setDiveShops] = useState<DiveShop[] | null>(null);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[] | null>(null);

  const handleOnLoad = async (map: MapView) => {
    setLocalMapRef(map);
    // Only the Main Map (no species) is registered as the global MapRef
    if (!species) {
      mapAction.setMapRef(map);
    }
  };

  const handleSeaLifeOptionSelected = async (seaCreature: string) => {
    if (!localMapRef) return;
    try {
      const seaLifeSet = await getCoordsForSeaLife(seaCreature);
      const coordinates = seaLifeSet.map(site => ({
        latitude: site.latitude,
        longitude: site.longitude,
      }));

      localMapRef.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    } catch (err) {
      console.warn("SeaLife zoom error:", err);
    }
  };

  const handleOnMapReady = () => {
    if (species) {
      handleSeaLifeOptionSelected(species);
    } else if (mapRegion && localMapRef) {
      localMapRef.animateToRegion(mapRegion, 10);
    }
    handleBoundsChange();
  };

  const getZoomFromBounds = (neLng: number, swLng: number) => {
    const lngDelta = Math.abs(neLng - swLng);
    const zoom = Math.log2((360 * mapPixelWidth) / (lngDelta * TILE_SIZE));
    return Math.floor(zoom);
  };

  const handleBoundsChange = debounce(async () => {
    if (!localMapRef) return;

    const boundaries = await localMapRef.getMapBoundaries();
    const currentBubble = GPSBubble.createFromBoundaries(boundaries);

    // 1. Notify the local listener (Histogram) if on Sea Life Screen
    if (onBoundsChangeLocal) {
      onBoundsChangeLocal(currentBubble);
    }

    // 2. PROTECT GLOBAL STORE: Only update lists if NOT a mini-map
    if (!species) {
      mapAction.setGpsBubble(currentBubble);
      mapAction.setMapRegion({
        latitude: (boundaries.northEast.latitude + boundaries.southWest.latitude) / 2,
        longitude: (boundaries.northEast.longitude + boundaries.southWest.longitude) / 2,
        latitudeDelta: Math.abs(boundaries.northEast.latitude - boundaries.southWest.latitude),
        longitudeDelta: Math.abs(boundaries.northEast.longitude - boundaries.southWest.longitude),
      });
    }

    const zoom = getZoomFromBounds(boundaries.northEast.longitude, boundaries.southWest.longitude);
    setZoomLevel(zoom);

    const [sites, shops] = await Promise.all([
      GPSBubble.getItemsInGpsBubble(getDiveSitesBasic, currentBubble),
      GPSBubble.getItemsInGpsBubble(getDiveShops, currentBubble, ""),
    ]);
    setDiveShops(shops);
    setDiveSites(sites);
  }, 50);

  return (
    <GoogleMapView
      mapConfig={mapConfig}
      center={camera?.center}
      onLoad={handleOnLoad}
      handleBoundsChange={handleBoundsChange}
      handleOnMapReady={handleOnMapReady}
      heatPoints={heatPoints}
      diveSites={diveSites}
      diveShops={diveShops}
      zoomLevel={zoomLevel}
      species={species}
    />
  );
}