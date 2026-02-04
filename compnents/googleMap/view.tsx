import React, { useEffect, useState, useMemo, useCallback, useRef, memo, useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Supercluster from "supercluster";
import useSupercluster, { UseSuperclusterArgument } from "use-supercluster";

import { DiveShop } from "../../entities/diveShop";
import { DiveSiteBasic } from "../../entities/diveSite";
import { Coordinates } from "../../entities/coordinates";
import { HeatPoint } from "../../entities/heatPoint";
import { getMostRecentPhoto } from "../../supabaseCalls/photoSupabaseCalls";
import SearchTool from "../searchTool";
import * as S from "../mapPage/styles";
import ButtonIcon from "../reusables/buttonIcon-new";
import { getCurrentCoordinates } from "../tutorial/locationTrackingRegistry";
import { Explainer } from "../screens/formScreens/explainer";
import { SitesArrayContext } from "../contexts/sitesArrayContext";

import { MarkerDiveShop } from "./marker/markerDiveShop";
import { MarkerDiveSite } from "./marker/markerDiveSite";
import { ClusterProperty, MapConfigurations, PointFeatureCategory } from "./types";
import { diveSiteToPointFeature } from "./dto/diveSiteToPointFeature";
import { diveShopToPointFeature } from "./dto/diveShopToPointFeature";
import { MarkerDiveSiteCluster } from "./marker/markerDiveSiteCluster";
import { MarkerDraggable } from "./marker/markerDraggable";
import { MarkerHeatPoint } from "./marker/markerHeatPoint";
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
};

const GoogleMapView = memo((props: MapViewProps) => {
  const [initialRegion, setInitialRegion] = useState<any>(null);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRegion = useMapStore((state) => state.mapRegion);
  const { sitesArray } = useContext(SitesArrayContext);

  // --- REFS ---
  const isMapReady = useRef(false);
  const isAnimating = useRef(false);
  const localMapRef = useRef<MapView | null>(null);

  // Use a state-based lock for the UI to prevent NSRangeException
  const [isMapLocked, setIsMapLocked] = useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "transparent", alignItems: "center", justifyContent: "center" },
    map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height }
  });

  const getStartLocation = async () => {
    try {
      const photoLocation = await getMostRecentPhoto();
      if (photoLocation) {
        setInitialRegion({
          latitude: photoLocation[0].latitude,
          longitude: photoLocation[0].longitude,
          latitudeDelta: 2,
          longitudeDelta: 0.4
        });
      }
    } catch (e) { console.log("Start Loc Error", e); }
  };

  const getCurrentLocation = async () => {
    if (!isMapReady.current) return;
    try {
      const { coords } = await getCurrentCoordinates();
      const activeMap = localMapRef.current || mapRef;
      if (coords && activeMap) {
        activeMap.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }, 500);
      }
    } catch (e) { console.log("Loc Error", e); }
  };

  const onMapLoad = useCallback((map: MapView | null) => {
    if (map) {
      localMapRef.current = map;
      props.onLoad(map);
    }
  }, [props.onLoad]);

  const points = useMemo(() => {
    const pts = [] as Supercluster.PointFeature<ClusterProperty>[];
    props.diveSites?.forEach((item) => pts.push(diveSiteToPointFeature(item)));
    props.diveShops?.forEach((item) => pts.push(diveShopToPointFeature(item)));
    return pts;
  }, [props.diveSites, props.diveShops]);

  const [clusterConfig, setClusterConfig] = useState<UseSuperclusterArgument<ClusterProperty, any>>({
    points: [],
    zoom: 0,
  });

  const { clusters, supercluster } = useSupercluster(clusterConfig);

  useEffect(() => {
    if (mapRegion) setInitialRegion(mapRegion);
    else getStartLocation();
  }, [mapRegion]);

  const syncClusters = useCallback(async () => {
    if (!localMapRef.current || !isMapReady.current || isAnimating.current) return;
    try {
      const bounds = await localMapRef.current.getMapBoundaries();
      if (!bounds) return;
      setClusterConfig({
        points,
        options: { radius: 50, maxZoom: 15 },
        zoom: props.zoomLevel,
        bounds: [
          bounds.southWest.longitude, bounds.southWest.latitude,
          bounds.northEast.longitude, bounds.northEast.latitude,
        ],
      });
    } catch (err) { }
  }, [points, props.zoomLevel]);

  useEffect(() => {
    syncClusters();
  }, [syncClusters]);

  const handleClusterPress = useCallback((clusterId: number, latitude: number, longitude: number) => {
    const activeMap = localMapRef.current || mapRef;
    if (!activeMap || !supercluster || isAnimating.current || !isMapReady.current) return;

    isAnimating.current = true;
    setIsMapLocked(true); // Lock the UI markers

    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 16);

    activeMap.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 1 / Math.pow(2, expansionZoom - 8),
      longitudeDelta: 1 / Math.pow(2, expansionZoom - 8),
    }, 500);

    // Release the lock after animation completes
    setTimeout(() => {
      isAnimating.current = false;
      setIsMapLocked(false);
      syncClusters();
    }, 600);
  }, [supercluster, mapRef, syncClusters]);

  if (!initialRegion) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <MapView
        key="diving-map-persistent-v-stable"
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        initialRegion={initialRegion}
        maxZoomLevel={16}
        minZoomLevel={1}
        ref={onMapLoad}
        onMapReady={() => {
          isMapReady.current = true;
          props.handleOnMapReady();
          syncClusters();
        }}
        onRegionChangeComplete={() => {
          if (isMapReady.current && !isAnimating.current) {
            props.handleBoundsChange();
            syncClusters();
          }
        }}
        toolbarEnabled={false}
      >
        {props?.heatPoints?.length > 0 && [0, 2].includes(props.mapConfig) && (
          <MarkerHeatPoint heatPoints={props.heatPoints} />
        )}

        {/* CRITICAL FIX: We skip mapping over clusters IF the map is locked/animating.
            This prevents NSRangeException by ensuring we don't try to add markers
            into a native view that is currently re-calculating indices.
        */}
        {!isMapLocked && clusters?.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties;

          if (isCluster) {
            return (
              <MarkerDiveSiteCluster
                key={`cluster-${cluster.id}`}
                coordinate={{ latitude, longitude }}
                pointCount={pointCount}
                onPress={() => handleClusterPress(cluster.id as number, latitude, longitude)}
              />
            );
          }

          const zoomKey = props.zoomLevel < 12 ? "lo" : "hi";

          if (cluster.properties.category === PointFeatureCategory.DiveSite) {
            const isSelected = sitesArray.includes(cluster.properties.id);
            return (
              <MarkerDiveSite
                key={`site-${cluster.properties.id}-${zoomKey}-${isSelected ? "blue" : "white"}`}
                id={cluster.properties.id}
                coordinate={{ latitude, longitude }}
                isSelected={isSelected}
              />
            );
          }

          if (cluster.properties.category === PointFeatureCategory.DiveShop) {
            return (
              <MarkerDiveShop
                key={`shop-${cluster.properties.id}-${zoomKey}`}
                id={cluster.properties.id}
                coordinate={{ latitude, longitude }}
              />
            );
          }
          return null;
        })}
      </MapView>

      {/* --- OVERLAYS --- */}
      {(props?.mapConfig !== MapConfigurations.Default && props?.mapConfig !== MapConfigurations.TripView) && (
        <SearchTool />
      )}

      {props?.mapConfig === MapConfigurations.PinDrop && <MarkerDraggable />}

      {props?.mapConfig === MapConfigurations.PinDrop && (
        <View style={{ position: "absolute", bottom: "5%", alignSelf: "center" }}>
          <S.TargetWrapperAlt><ButtonIcon icon="target" size={36} onPress={getCurrentLocation} /></S.TargetWrapperAlt>
          <View onTouchStart={() => { isMapReady.current = false; }}>
            <ReturnToSiteSubmitterButton />
          </View>
        </View>
      )}

      {props?.mapConfig === MapConfigurations.TripView && (
        <View style={{ position: "absolute", bottom: "5%", width: "100%", alignItems: "center" }}>
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