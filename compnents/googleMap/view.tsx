import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

type MapViewProps = {
  // googleMapApiKey:    string
  // options?:           google.maps.MapOptions
  // mapConfig:          number
  // zoom?:              number
  // center:             google.maps.LatLngLiteral
  // tempMarker?:        google.maps.LatLngLiteral | null
  onLoad: (map: MapView) => void;
  handleBoundsChange: () => void;
  // diveSites?:         DiveSiteBasic[] | null
  // diveShops?:         DiveShop[] | null
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
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

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
        ref={(ref) => props.onLoad(ref)}
        onMapReady={(a) => console.log("ready", { a })}
        onRegionChangeComplete={() => props.handleBoundsChange()}
        toolbarEnabled={false}
      />
    </View>
  );

  return (
    <MapView
      key={1}
      // style={styles.map}
      provider={PROVIDER_GOOGLE}
      mapType="hybrid"
      region={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      ref={(ref) => props.onLoad(ref)}
      // onMapReady={() => handleMapChange()}
      // onRegionChangeComplete={() => updateMapCenter()}
      toolbarEnabled={false}
    ></MapView>
  );
}
