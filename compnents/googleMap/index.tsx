import React, { useContext, useEffect, useState } from "react";
import MapView from "react-native-maps";
import { Dimensions } from "react-native";

import { debounce } from "../reusables/_helpers/debounce";
import { GPSBubble } from "../../entities/GPSBubble";
import { getDiveSitesBasic, getDiveSitesByIDs } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { getDiveShops } from "../../supabaseCalls/shopsSupabaseCalls";
import { DiveSiteBasic } from "../../entities/diveSite";
import { DiveShop } from "../../entities/diveShop";
import { getHeatPoints } from "../../supabaseCalls/heatPointSupabaseCalls";
import { HeatPoint } from "../../entities/heatPoint";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { getCoordsForSeaLife } from "../../supabaseCalls/photoSupabaseCalls";

import { useMapStore } from "./useMapStore";
import GoogleMapView from "./view";
import { MapConfigurations } from "./types";

type GoogleMapProps = {
  species?: string;
};

export default function GoogleMap({ species }: GoogleMapProps) {
  const { width: mapPixelWidth } = Dimensions.get("window");
  const TILE_SIZE = 256;
  const [zoomLevel, setZoomLevel] = useState(1);
  const { sitesArray } = useContext(SitesArrayContext);
  const mapAction = useMapStore((state) => state.actions);

  const camera = useMapStore((state) => state.camera);
  const mapRef = useMapStore((state) => state.mapRef);
  const bubble = useMapStore((state) => state.gpsBubble);
  const mapRegion = useMapStore((state) => state.mapRegion);
  const mapConfig = useMapStore((state) => state.mapConfig);
  const initConfig = useMapStore((state) => state.initConfig);

  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const [diveSites, setDiveSites] = useState<DiveSiteBasic[] | null>(null);
  const [diveShops, setDiveShops] = useState<DiveShop[] | null>(null);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[] | null>(null);

  const handleOnLoad = async (map: MapView) => {
    mapAction.setMapRef(map);
  };

  const moveToTrip = async (siteIds: number[]) => {
    const itinerizedDiveSites = await getDiveSitesByIDs(JSON.stringify(siteIds));

    const coordinates = itinerizedDiveSites.map(site => ({
      latitude: site.lat,
      longitude: site.lng,
    }));

    mapRef?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  const handleSeaLifeOptionSelected = async (seaCreature: string) => {
    try {
      const seaLifeSet = await getCoordsForSeaLife(seaCreature);

      const coordinates = seaLifeSet.map(site => ({
        latitude: site.latitude,
        longitude: site.longitude,
      }));

      mapRef?.fitToCoordinates(coordinates, {
        edgePadding: species ? { top: 50, right: 0, bottom: 50, left: 0 } : { top: 150, right: 50, bottom: 300, left: 50 },
        animated: true,
      });

    } catch (err) {
      console.warn("Geocoder error:", err);
    }
  };

  const handleOnMapReady = () => {

    if (species) {
      handleSeaLifeOptionSelected(species);
    }

    handleBoundsChange();

    switch (initConfig) {
      case MapConfigurations.Default:
        if (mapRegion && mapRef) {
          mapRef.animateToRegion(mapRegion, 10);
        }
        break;
      case MapConfigurations.PinDrop:
        break;
      case MapConfigurations.TripView:
        moveToTrip(sitesArray);
        break;
      case MapConfigurations.TripBuild:
        if (sitesArray.length > 0) {
          moveToTrip(sitesArray);
        }
        break;
    }
  };

  const getZoomFromBounds = (neLng: number, swLng: number) => {
    const lngDelta = Math.abs(neLng - swLng);
    const zoom = Math.log2((360 * mapPixelWidth) / (lngDelta * TILE_SIZE));
    return Math.floor(zoom);
  };

  useEffect(() => {
    (async () => {
      const heatPoints = await GPSBubble.getItemsInGpsBubble(getHeatPoints, bubble, { animal: species && [species] });
      setHeatPoints(heatPoints);
    })();
  }, [animalMultiSelection, bubble]);

  const handleBoundsChange = debounce(async () => {
    if (!mapRef) {
      return;
    }

    const boundaries = await mapRef.getMapBoundaries();
    const bubble = GPSBubble.createFromBoundaries(boundaries);
    mapAction.setGpsBubble(bubble);

    const zoom = getZoomFromBounds(boundaries.northEast.longitude, boundaries.southWest.longitude);
    setZoomLevel(zoom);

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
      zoomLevel={zoomLevel}
      species={species}
    />
  );
}