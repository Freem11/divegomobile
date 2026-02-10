import React, { useContext, useEffect, useState, useRef } from "react";
import MapView from "react-native-maps";
import { Dimensions } from "react-native";

import { debounce } from "../reusables/_helpers/debounce";
import { GPSBubble } from "../../entities/GPSBubble";
import { getDiveSitesBasic, getDiveSitesByIDs } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { getDiveShops } from "../../supabaseCalls/shopsSupabaseCalls";
import { getHeatPoints } from "../../supabaseCalls/heatPointSupabaseCalls";
import { DiveSiteBasic } from "../../entities/diveSite";
import { DiveShop } from "../../entities/diveShop";
import { HeatPoint } from "../../entities/heatPoint";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { getCoordsForSeaLife } from "../../supabaseCalls/photoSupabaseCalls";

import { MapConfigurations } from "./types";
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
  const initConfig = useMapStore((state) => state.initConfig);
  const bubble = useMapStore((state) => state.gpsBubble);

  const { sitesArray } = useContext(SitesArrayContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const [localMapRef, setLocalMapRef] = useState<MapView | null>(null);
  const isInitialMoveDone = useRef(false);

  const [fullTripSites, setFullTripSites] = useState<any[]>([]);
  const [diveSites, setDiveSites] = useState<DiveSiteBasic[] | null>(null);
  const [diveShops, setDiveShops] = useState<DiveShop[] | null>(null);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[] | null>(null);

  const handleOnLoad = async (map: MapView) => {
    setLocalMapRef(map);
    if (!species) {
      mapAction.setMapRef(map);
    }
  };

  /**
   * HEATPOINT RESTORATION
   */
  useEffect(() => {
    (async () => {
      const heatPointsData = await GPSBubble.getItemsInGpsBubble(
        getHeatPoints,
        bubble,
        { animal: animalMultiSelection && [animalMultiSelection] }
      );
      setHeatPoints(heatPointsData);
    })();
  }, [animalMultiSelection, bubble]);

  /**
   * HYDRATION LOGIC
   */
  useEffect(() => {
    const hydrateTrip = async () => {
      if (!sitesArray || sitesArray.length === 0) return;

      const ids = sitesArray
        .map((s: any) => (s && typeof s === "object" ? s.id : s))
        .filter((id) => id !== undefined && id !== null);

      if (ids.length > 0) {
        try {
          const fullSites = await getDiveSitesByIDs(JSON.stringify(ids));
          if (fullSites) {
            setFullTripSites(fullSites);
          }
        } catch (err) {
          console.warn("Error hydrating trip sites:", err);
        }
      }
    };

    if (initConfig === MapConfigurations.TripView || initConfig === MapConfigurations.TripBuild) {
      hydrateTrip();
    }
  }, [sitesArray, initConfig]);

  /**
   * MOVE TO TRIP
   */
  const moveToTrip = (sites: any[]) => {
    if (!localMapRef || !sites || sites.length === 0) return;

    const coordinates = sites.map(site => ({
      latitude: Number(site.lat),
      longitude: Number(site.lng),
    })).filter(c => !isNaN(c.latitude) && !isNaN(c.longitude));

    if (coordinates.length > 0) {
      localMapRef.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const handleSeaLifeFocus = async (creature: string) => {
    if (!localMapRef) return;
    try {
      const seaLifeSet = await getCoordsForSeaLife(creature);
      const coords = seaLifeSet.map((site) => ({
        latitude: Number(site.latitude),
        longitude: Number(site.longitude),
      }));
      if (coords.length > 0) {
        localMapRef.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      console.warn("SeaLife focus error:", err);
    }
  };

  /**
   * WATCHER
   */
  useEffect(() => {
    if (!localMapRef || isInitialMoveDone.current) return;

    const performInitialMove = () => {
      if (species) {
        handleSeaLifeFocus(species);
        isInitialMoveDone.current = true;
      } else {
        switch (initConfig) {
          case MapConfigurations.Default:
            if (mapRegion) {
              localMapRef.animateToRegion(mapRegion, 10);
              isInitialMoveDone.current = true;
            }
            break;
          case MapConfigurations.TripView:
          case MapConfigurations.TripBuild:
            if (fullTripSites && fullTripSites.length > 0) {
              moveToTrip(fullTripSites);
              isInitialMoveDone.current = true;
            }
            break;
          default:
            if (initConfig !== undefined) isInitialMoveDone.current = true;
            break;
        }
      }
    };

    const timer = setTimeout(performInitialMove, 250);
    return () => clearTimeout(timer);
  }, [localMapRef, fullTripSites, species, initConfig, mapRegion]);

  const handleOnMapReady = () => {
    handleBoundsChange();
  };

  const getZoomFromBounds = (neLng: number, swLng: number) => {
    const lngDelta = Math.abs(neLng - swLng);
    return Math.floor(Math.log2((360 * mapPixelWidth) / (lngDelta * TILE_SIZE)));
  };

  const handleBoundsChange = debounce(async () => {
    if (!localMapRef) return;
    const boundaries = await localMapRef.getMapBoundaries();
    const currentBubble = GPSBubble.createFromBoundaries(boundaries);

    if (onBoundsChangeLocal) {
      onBoundsChangeLocal(currentBubble);
    }

    if (!species) {
      mapAction.setGpsBubble(currentBubble);
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