import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Camera, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { DiveShop } from "../../entities/diveShop";
import { DiveSiteBasic } from "../../entities/diveSite";
import { MarkerDiveShop } from "./marker/markerDiveShop";
import { MarkerDiveSite } from "./marker/markerDiveSite";
// import image from "../../../png/mapIcons/AnchorBlue.png";
import image from "../png/mapIcons/AnchorBlue.png";
import Supercluster from "supercluster";
import useSupercluster, { UseSuperclusterArgument } from "use-supercluster";
import { ClusterProperty, PointFeatureCategory } from "./types";
import { diveSiteToPointFeature } from "./dto/diveSiteToPointFeature";
import { diveShopToPointFeature } from "./dto/diveShopToPointFeature";
import { MarkerDiveSiteCluster } from "./marker/markerDiveSiteCluster";
import { MarkerDraggable } from "./marker/markerDraggable";
import { Coordinates } from "../../entities/coordinates";

type MapViewProps = {
  // googleMapApiKey:    string
  // options?:           google.maps.MapOptions
  mapConfig: number;
  // zoom?:              number
  center: Coordinates;
  // tempMarker?:        google.maps.LatLngLiteral | null
  onLoad: (map: MapView) => void;
  handleBoundsChange: () => void;
  diveSites?: DiveSiteBasic[] | null;
  diveShops?: DiveShop[] | null;
  // heatPoints?:        HeatPoint[] | null
};

export default function GoogleMapView(props: MapViewProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    map: {
      width: "100%",
      height: "100%",
    },
  });

  const region = {
    latitude: 37.6899333333333,
    longitude: -122.9951,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // console.log(props.diveSites[0]);

  // return (
  //   <MapView region={region}>
  //     <Marker key={"aa"} coordinate={{ latitude: 49.15015, longitude: -124.792317 }} title={"AA"} description={"BB"} />
  //   </MapView>
  // );
  const [map, setMap] = useState<MapView | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  console.log("Map Viewww");
  // return null;
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

      const points = [] as Supercluster.PointFeature<ClusterProperty>[];
      props.diveSites?.forEach((item) =>
        points.push(diveSiteToPointFeature(item))
      );
      props.diveShops?.forEach((item) =>
        points.push(diveShopToPointFeature(item))
      );
      setClusterConfig({
        points: points,
        // options: { radius: 75, maxZoom: 16 },
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

  return (
    <View style={styles.container}>
      <MapView
        key={1}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        initialRegion={region}
        maxZoomLevel={16}
        minZoomLevel={1}
        ref={onMapLoad}
        onMapReady={(a) => console.log("ready", { a })}
        onRegionChangeComplete={() => props.handleBoundsChange()}
        toolbarEnabled={false}
      >
        {clusters.map((cluster) => {
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
        })}

        {props.mapConfig === 1 && camera?.center && (
          <MarkerDraggable coordinate={camera.center} />
        )}
      </MapView>
    </View>
  );
}
