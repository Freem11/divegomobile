import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Supercluster from "supercluster";
import useSupercluster, { UseSuperclusterArgument } from "use-supercluster";
import { useFocusEffect } from "@react-navigation/native";

import { DiveShop } from "../../entities/diveShop";
import { DiveSiteBasic } from "../../entities/diveSite";
import { Coordinates } from "../../entities/coordinates";
import { HeatPoint } from "../../entities/heatPoint";
import { getMostRecentPhoto } from "../../supabaseCalls/photoSupabaseCalls";
import { getDiveSitesByIDs } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { SitesArrayContext } from "../contexts/sitesArrayContext";

import { MarkerDiveShop } from "./marker/markerDiveShop";
import { MarkerDiveSite } from "./marker/markerDiveSite";
import { ClusterProperty, PointFeatureCategory } from "./types";
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

  /**
   * On load event happens a lot - dont put heavy stuff here
   * @param map
   * @returns
   */
  onLoad: (map: MapView) => void;
  handleBoundsChange: () => void;
  handleOnMapReady: () => void;
  diveSites?: DiveSiteBasic[] | null;
  diveShops?: DiveShop[] | null;
  heatPoints?: HeatPoint[] | null
};

export default function GoogleMapView(props: MapViewProps) {
  const [timoutId, setTimoutId] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const { sitesArray } = useContext(SitesArrayContext);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapConfig = useMapStore((state) => state.mapConfig);
  const mapRegion = useMapStore((state) => state.mapRegion);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    map: {
      width: Dimensions.get("window").width,
      height: "100%",
    }
  });

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

  if (mapConfig === 2) {
    moveToTrip(sitesArray);
  }

  const getCurrentLocation = async () => {
    try {
      const photoLocation = await getMostRecentPhoto();
      if (photoLocation) {
        setInitialRegion({
          ...initialRegion,
          latitude: photoLocation[0].latitude,
          longitude: photoLocation[0].longitude,
          latitudeDelta: 2,
          longitudeDelta: 0.4
        });
      }
    } catch (e) {
      console.log({ title: "Error65", message: e.message });
    }
  };

  const [map, setMap] = useState<MapView | null>(null);

  const onMapLoad = async (map: MapView) => {

    setMap(map);
    if (typeof props.onLoad === "function") {
      props.onLoad(map);
    }
  };

  const [clusterConfig, setClusterConfig] = useState<
    UseSuperclusterArgument<ClusterProperty, Supercluster.AnyProps>
  >({
    points: [],
    zoom: 0,
  });
  const { clusters, supercluster } = useSupercluster(clusterConfig);

  useEffect(() => {
    if (mapRegion) {
      setInitialRegion(mapRegion);
    } else {
      getCurrentLocation();
    }
  }, [mapRegion]);

  useFocusEffect(
    React.useCallback(() => {
      if (mapRegion && mapRef) {
        const timerId = setTimeout(() => {
          mapRef.animateToRegion(mapRegion, 10);
        }, 500);
        setTimoutId(timerId);

      }

      return () => {
        if (timoutId) {
          clearTimeout(timoutId);
        }
        setMapRegion(null);
      };
    }, [mapRef, mapRegion])
  );

  useEffect(() => {
    (async () => {
      if (!map) {
        return;
      }

      const bounds = await map.getMapBoundaries();
      if (!bounds) {
        return;
      }

      const camera = await map.getCamera();
      if (!camera) {
        return;
      }

      let MapZoom: number;
      if (props.zoomLevel < 5) {
        MapZoom = 500;
      } else if (props.zoomLevel < 6) {
        MapZoom = 350;
      } else if (props.zoomLevel < 7) {
        MapZoom = 300;
      } else if (props.zoomLevel < 8) {
        MapZoom = 250;
      } else if (props.zoomLevel < 9) {
        MapZoom = 200;
      } else if (props.zoomLevel < 10) {
        MapZoom = 150;
      } else if (props.zoomLevel < 11) {
        MapZoom = 100;
      } else if (props.zoomLevel < 12) {
        MapZoom = 50;
      } else {
        MapZoom = 25;
      }
      const points = [] as Supercluster.PointFeature<ClusterProperty>[];
      props.diveSites?.forEach((item) =>
        points.push(diveSiteToPointFeature(item))
      );
      props.diveShops?.forEach((item) =>
        points.push(diveShopToPointFeature(item))
      );
      setClusterConfig({
        points: points,
        options: { radius: MapZoom },
        zoom: camera.zoom,
        bounds: [
          bounds.southWest.longitude,
          bounds.southWest.latitude,
          bounds.northEast.longitude,
          bounds.northEast.latitude,
        ],
      });
    })();
  }, [props.diveSites, props.diveShops]);

  if (!initialRegion) {
    return (
      <View style={styles.container}>
        {/* Or a Loading indicator */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        key={props.mapConfig}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        initialRegion={initialRegion}
        maxZoomLevel={16}
        minZoomLevel={1}
        ref={onMapLoad}
        onMapReady={() => props.handleOnMapReady()}
        onRegionChangeComplete={() => props.handleBoundsChange()}
        toolbarEnabled={false}
      >
        {props?.heatPoints?.length > 0 && [0, 2].includes(props.mapConfig) && (
          <MarkerHeatPoint heatPoints={props.heatPoints} />
        )}

        {clusters?.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster } = cluster.properties;

          if (isCluster) {
            return (
              <MarkerDiveSiteCluster
                key={cluster.id}
                coordinate={{ latitude, longitude }}
                getExpansionZoom={() => {
                  return supercluster.getClusterExpansionZoom(+cluster.id);
                }}
              />
            );
          }

          if (cluster.properties.category === PointFeatureCategory.DiveSite) {
            return (
              <MarkerDiveSite
                key={cluster.id}
                id={cluster.properties.id}
                coordinate={{ latitude, longitude }}
              />
            );
          }

          if (cluster.properties.category === PointFeatureCategory.DiveShop) {
            return (
              <MarkerDiveShop
                key={cluster.id}
                id={cluster.properties.id}
                coordinate={{ latitude, longitude }}
              />
            );
          }
          return null;
        })}

      </MapView>

      {props?.mapConfig === 1 && (
        <MarkerDraggable />
      )}

      {props?.mapConfig === 1 && (
        <View style={{ position: "absolute", bottom: "5%", alignSelf: "center" }}>
          <ReturnToSiteSubmitterButton />
        </View>
      )}
      {props?.mapConfig === 2 && (
        <View style={{ position: "absolute", bottom: "5%", alignSelf: "center" }}>
          <ReturnToShopButton />
        </View>
      )}
      {props?.mapConfig === 3 && (
        <View style={{ position: "absolute", bottom: "5%", alignSelf: "center" }}>
          <ReturnToCreateTripButton />
        </View>
      )}

    </View>
  );
}
