import React, { useEffect, useState, useMemo, useCallback, useRef, memo, useContext } from "react";
import { Dimensions, StyleSheet, View, InteractionManager } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import Supercluster from "supercluster";
import useSupercluster from "use-supercluster";

import { getMostRecentPhoto } from "../../supabaseCalls/photoSupabaseCalls";
import SearchTool from "../searchTool";
import * as S from "../mapPage/styles";
import ButtonIcon from "../reusables/buttonIcon-new";
import { getCurrentCoordinates } from "../tutorial/locationTrackingRegistry";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import BottomDrawer from "../screens/bottomDrawer/animatedBottomDrawer";
import DiveSiteSearchList from "../screens/diveSiteSearch/diveSiteSearchList";

import MarkerDiveShop from "./marker/markerDiveShop";
import MarkerDiveSite from "./marker/markerDiveSite";
import MarkerDiveSiteCluster from "./marker/markerDiveSiteCluster";
import MarkerHeatPoint from "./marker/markerHeatPoint";
import { ClusterProperty, MapConfigurations, PointFeatureCategory, ScreenReturn } from "./types";
import { diveSiteToPointFeature } from "./dto/diveSiteToPointFeature";
import { diveShopToPointFeature } from "./dto/diveShopToPointFeature";
import { MarkerDraggable } from "./marker/markerDraggable";
import { ReturnToSiteSubmitterButton } from "./navigation/returnToSiteSubmitterButton";
import { ReturnToShopButton } from "./navigation/returnToShopButton";
import { ReturnToCreateTripButton } from "./navigation/returnToCreateTripButton";
import { useMapStore } from "./useMapStore";

const { width, height } = Dimensions.get("window");
const MAX_PADDING = 300; // This should roughly match your drawer's open height

const GoogleMapView = memo((props: GoogleMapsProps) => {
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapRegion = useMapStore((state) => state.mapRegion);
  const { sitesArray } = useContext(SitesArrayContext);

  const isMapReady = useRef(false);
  const isAnimating = useRef(false);
  const localMapRef = useRef<MapView | null>(null);

  const [paddingBottom, setPaddingBottom] = useState(0);

  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>(undefined);
  const [zoom, setZoom] = useState(props.zoomLevel);

  const lastSyncZoom = useRef<number>(props.zoomLevel);
  const lastSyncBounds = useRef<string>("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    map: {
      width: props.species ? "100%" : width,
      height: props.species ? "100%" : height,
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

  const points = useMemo(() => {
    const pts = [] as Supercluster.PointFeature<ClusterProperty>[];
    props.diveSites?.forEach((item) => {
      if (!sitesArray.includes(item.id)) {
        pts.push(diveSiteToPointFeature(item));
      }
    });
    props.diveShops?.forEach((item) => pts.push(diveShopToPointFeature(item)));
    return pts;
  }, [props.diveSites, props.diveShops, sitesArray]);

  const { clusters = [] } = useSupercluster({
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

  const getCurrentLocation = async () => {
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

  const isValidCoord = (lat: number, lng: number) =>
    typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng);

  const renderedMarkers = useMemo(() => {
    const mapElements: React.ReactNode[] = [];
    const safeClusters = clusters ?? [];
    for (const cluster of safeClusters) {
      const coords = cluster?.geometry?.coordinates;
      if (!Array.isArray(coords) || coords.length < 2) continue;
      const [longitude, latitude] = coords;
      if (!isValidCoord(latitude, longitude)) continue;

      const { cluster: isCluster, point_count: pointCount, id, category } = cluster.properties;
      const stableKey = isCluster
        ? `cluster-${id}-${latitude.toFixed(4)}-${longitude.toFixed(4)}`
        : `${category}-${id}`;
      const coord = { latitude, longitude };
      const siteData = props.diveSites?.find(s => s.id === id);

      if (isCluster) {
        mapElements.push(
          <MarkerDiveSiteCluster
            key={stableKey}
            coordinate={coord}
            pointCount={pointCount}
            onPress={() => handleClusterPress(id as number, latitude, longitude)}
          />
        );
        continue;
      }
      if (category === PointFeatureCategory.DiveSite) {
        mapElements.push(
          <MarkerDiveSite
            key={stableKey}
            id={id as number}
            coordinate={coord}
            isSelected={false}
            siteNumber={siteData?.siteNumber}
          />
        );
        continue;
      }
      if (category === PointFeatureCategory.DiveShop) {
        mapElements.push(
          <MarkerDiveShop key={stableKey} id={id as number} coordinate={coord} />
        );
      }
    }

    const goldElements = (props.diveSites || [])
      .filter((site) => sitesArray.includes(site.id) && isValidCoord(site.lat, site.lng))
      .map((site) => (
        <MarkerDiveSite
          key={`gold-${site.id}`}
          id={site.id}
          coordinate={{ latitude: site.lat, longitude: site.lng }}
          isSelected={true}
          siteNumber={site.siteNumber}
        />
      ));

    return [...mapElements, ...goldElements];
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
        // KEY CHANGE: Add mapPadding
        // This ensures the "logical center" of the map is above the drawer
        mapPadding={{ top: 0, right: 0, left: 0, bottom: paddingBottom }}
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

      {(props?.mapConfig !== MapConfigurations.Default && props?.mapConfig !== MapConfigurations.TripView) && (
        <SearchTool />
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

      {props?.mapConfig === MapConfigurations.DiveSiteSearch && (
        <View style={{ position: "absolute", bottom: 0, width: "100%", alignItems: "center" }}>
          <BottomDrawer
            mapRegion={mapRegion}
            mapConfig={props.mapConfig}
            Content={() => <DiveSiteSearchList nextScreen={props.nextScreen} />}
            onProgress={(val) => {
              // Map the 0-1 progress to 0-300px padding
              setPaddingBottom(val * MAX_PADDING);
            }}
          />
        </View>
      )}
    </View>
  );
});

export default GoogleMapView;