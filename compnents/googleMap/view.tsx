import React, { useEffect, useState, useMemo, useCallback, useRef, memo, useContext } from "react";
import { Dimensions, StyleSheet, View, InteractionManager } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import Supercluster from "supercluster";
import useSupercluster from "use-supercluster";

import { DiveShop } from "../../entities/diveShop";
import { DiveSiteBasic } from "../../entities/diveSite";
import { Coordinates } from "../../entities/coordinates";
import { HeatPoint } from "../../entities/heatPoint";
import { getMostRecentPhoto } from "../../supabaseCalls/photoSupabaseCalls";
import SearchTool from "../searchTool";
import * as S from "../mapPage/styles";
import ButtonIcon from "../reusables/buttonIcon-new";
import { getCurrentCoordinates } from "../tutorial/locationTrackingRegistry";
import { SitesArrayContext } from "../contexts/sitesArrayContext";

import MarkerDiveShop from "./marker/markerDiveShop";
import MarkerDiveSite from "./marker/markerDiveSite";
import MarkerDiveSiteCluster from "./marker/markerDiveSiteCluster";
import MarkerHeatPoint from "./marker/markerHeatPoint";
import { ClusterProperty, MapConfigurations, PointFeatureCategory } from "./types";
import { diveSiteToPointFeature } from "./dto/diveSiteToPointFeature";
import { diveShopToPointFeature } from "./dto/diveShopToPointFeature";
import { MarkerDraggable } from "./marker/markerDraggable";
import { ReturnToSiteSubmitterButton } from "./navigation/returnToSiteSubmitterButton";
import { ReturnToShopButton } from "./navigation/returnToShopButton";
import { ReturnToCreateTripButton } from "./navigation/returnToCreateTripButton";
import { useMapStore } from "./useMapStore";

type MapViewProps = {
  mapConfig: number;
  center: Coordinates;
  zoomLevel: number;
  onLoad: (map: MapView) => void;
  handleBoundsChange: () => void;
  handleOnMapReady: () => void;
  diveSites?: DiveSiteBasic[] | null;
  diveShops?: DiveShop[] | null;
  heatPoints?: HeatPoint[] | null;
  species?: string;
};

const GoogleMapView = memo((props: MapViewProps) => {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRegion = useMapStore((state) => state.mapRegion);
  const { sitesArray } = useContext(SitesArrayContext);

  const isMapReady = useRef(false);
  const isAnimating = useRef(false);
  const localMapRef = useRef<MapView | null>(null);

  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>(undefined);
  const [zoom, setZoom] = useState(props.zoomLevel);

  const lastSyncZoom = useRef<number>(props.zoomLevel);
  const lastSyncBounds = useRef<string>("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    map: {
      width: props.species ? "100%" : Dimensions.get("window").width,
      height: props.species ? "100%" : Dimensions.get("window").height,
    }
  });

  const getBoundsFromRegion = (region: Region): [number, number, number, number] => {
    const latD = Math.abs(region.latitudeDelta);
    const lonD = Math.abs(region.longitudeDelta);
    return [
      region.longitude - lonD / 2,
      region.latitude - latD / 2,
      region.longitude + lonD / 2,
      region.latitude + latD / 2,
    ];
  };

  const getZoomFromRegion = (region: Region): number => {
    return Math.round(Math.log2(360 / region.longitudeDelta));
  };

  /**
   * FIX: BREAKOUT LOGIC
   * We filter out selected sites from the 'points' array so the cluster engine
   * doesn't "swallow" Gold anchors into a cluster bubble.
   */
  const points = useMemo(() => {
    const pts = [] as Supercluster.PointFeature<ClusterProperty>[];

    props.diveSites?.forEach((item) => {
      const isSelected = sitesArray.includes(item.id);
      // Only add to cluster engine if NOT selected
      if (!isSelected) {
        pts.push(diveSiteToPointFeature(item));
      }
    });

    props.diveShops?.forEach((item) => pts.push(diveShopToPointFeature(item)));
    return pts;
  }, [props.diveSites, props.diveShops, sitesArray]);

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 50, maxZoom: 17 }
  });

  useEffect(() => {
    if (mapRegion) {
      setInitialRegion(mapRegion);
    } else {
      getMostRecentPhoto().then((loc) => {
        if (loc && loc[0]) {
          setInitialRegion({
            latitude: loc[0].latitude,
            longitude: loc[0].longitude,
            latitudeDelta: 2,
            longitudeDelta: 0.4
          });
        } else {
          setInitialRegion({ latitude: 0, longitude: 0, latitudeDelta: 10, longitudeDelta: 10 });
        }
      });
    }
  }, []);

  const updateMapPositions = useCallback((region: Region) => {
    const nextZoom = getZoomFromRegion(region);
    const rawBounds = getBoundsFromRegion(region);
    const boundsFingerprint = rawBounds.map(b => b.toFixed(4)).join(",");

    if (nextZoom !== lastSyncZoom.current || boundsFingerprint !== lastSyncBounds.current) {
      lastSyncZoom.current = nextZoom;
      lastSyncBounds.current = boundsFingerprint;

      InteractionManager.runAfterInteractions(() => {
        setZoom(nextZoom);
        setBounds(rawBounds);
      });
    }
  }, []);

  const getCurrentLocation = async() => {
    if (!isMapReady.current) return;
    try {
      const { coords } = await getCurrentCoordinates();
      const activeMap = localMapRef.current || mapRef;
      if (coords && activeMap) {
        activeMap.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 500);
      }
    } catch (e) { console.log("Loc Error", e); }
  };

  const handleClusterPress = useCallback((clusterId: number, latitude: number, longitude: number) => {
    const activeMap = localMapRef.current || mapRef;
    if (!activeMap || isAnimating.current) return;

    const currentZoom = lastSyncZoom.current;
    const nextZoom = Math.min(currentZoom + 3, 16);

    isAnimating.current = true;
    activeMap.animateCamera({
      center: { latitude, longitude },
      zoom: nextZoom,
    }, { duration: 400 });

    setTimeout(() => {
      isAnimating.current = false;
      const nextDelta = 360 / Math.pow(2, nextZoom);
      updateMapPositions({
        latitude,
        longitude,
        latitudeDelta: nextDelta,
        longitudeDelta: nextDelta
      });
    }, 500);
  }, [mapRef, updateMapPositions]);

  /**
   * FIX: TWO-PASS RENDERING
   * We render standard clusters/unselected sites first, then overlay Gold sites
   */
  const renderedMarkers = useMemo(() => {
    if (!clusters) return [];

    // Pass 1: Standard clusters and unselected items
    const mapElements = clusters.map((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const { cluster: isCluster, point_count: pointCount, id, category } = cluster.properties;

      const stableKey = isCluster
        ? `cluster-${id}-${latitude.toFixed(4)}-${longitude.toFixed(4)}`
        : `${category}-${id}`;

      if (isCluster) {
        return (
          <MarkerDiveSiteCluster
            key={stableKey}
            coordinate={{ latitude, longitude }}
            pointCount={pointCount}
            onPress={() => handleClusterPress(id as number, latitude, longitude)}
          />
        );
      }

      if (category === PointFeatureCategory.DiveSite) {
        return (
          <MarkerDiveSite
            key={stableKey}
            id={id as number}
            coordinate={{ latitude, longitude }}
            isSelected={false}
          />
        );
      }

      if (category === PointFeatureCategory.DiveShop) {
        return (
          <MarkerDiveShop
            key={stableKey}
            id={id as number}
            coordinate={{ latitude, longitude }}
          />
        );
      }
      return null;
    });

    // Pass 2: Selected Gold Sites (Rendered on top, excluded from clusters)
    const goldElements = (props.diveSites || [])
      .filter((site) => sitesArray.includes(site.id))
      .map((site) => (
        <MarkerDiveSite
          key={`gold-${site.id}`}
          id={site.id}
          coordinate={{ latitude: site.lat, longitude: site.lng }}
          isSelected={true}
        />
      ));

    return [...mapElements, ...goldElements].filter(Boolean);
  }, [clusters, sitesArray, props.diveSites, handleClusterPress]);

  if (!initialRegion) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <MapView
        key="diving-map-v-stable-final"
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        initialRegion={initialRegion}
        maxZoomLevel={16}
        ref={(map) => {
          if (map) {
            localMapRef.current = map;
            props.onLoad(map);
          }
        }}
        onMapReady={() => {
          isMapReady.current = true;
          props.handleOnMapReady();
          updateMapPositions(initialRegion);
        }}
        onRegionChangeComplete={(region) => {
          if (!isAnimating.current) {
            props.handleBoundsChange();
            updateMapPositions(region);
          }
        }}
        toolbarEnabled={false}
      >
        {props?.heatPoints && props.heatPoints.length > 0 && [0, 2].includes(props.mapConfig) && (
          <MarkerHeatPoint heatPoints={props.heatPoints} />
        )}
        {renderedMarkers}
      </MapView>

      {/* --- UI OVERLAYS RESTORED --- */}

      {(props?.mapConfig !== MapConfigurations.Default && props?.mapConfig !== MapConfigurations.TripView) && (
        <SearchTool />
      )}

      {props?.mapConfig === MapConfigurations.Default && !props.species && (
        <View style={{ position: "absolute", bottom: "5%", right: "5%" }}>
          <S.TargetWrapperAlt>
            <ButtonIcon icon="target" size={36} onPress={getCurrentLocation} />
          </S.TargetWrapperAlt>
        </View>
      )}

      {props?.mapConfig === MapConfigurations.PinDrop && (
        <>
          <MarkerDraggable />
          <View style={{ position: "absolute", bottom: "5%", alignSelf: "center" }}>
            <S.TargetWrapperAlt><ButtonIcon icon="target" size={36} onPress={getCurrentLocation} /></S.TargetWrapperAlt>
            <View onTouchStart={() => { isMapReady.current = false; }}>
              <ReturnToSiteSubmitterButton />
            </View>
          </View>
        </>
      )}

      {props?.mapConfig === MapConfigurations.TripView && (
        <View style={{ position: "absolute", bottom: "5%", width: "100%", alignItems: "center" }}>
          <S.TargetWrapperAlt><ButtonIcon icon="target" size={36} onPress={getCurrentLocation} /></S.TargetWrapperAlt>
          <ReturnToShopButton />
        </View>
      )}

      {props?.mapConfig === MapConfigurations.TripBuild && (
        <View style={{ position: "absolute", bottom: "5%", width: "100%", alignItems: "center" }}>
          <S.TargetWrapperAlt><ButtonIcon icon="target" size={36} onPress={getCurrentLocation} /></S.TargetWrapperAlt>
          <ReturnToCreateTripButton />
        </View>
      )}

    </View>
  );
});

export default GoogleMapView;