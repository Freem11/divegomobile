import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { DiveShop } from "../../entities/diveShop";
import { DiveSiteBasic } from "../../entities/diveSite";
import { MarkerDiveShop } from "./marker/markerDiveShop";
import { MarkerDiveSite } from "./marker/markerDiveSite";
// import image from "../../../png/mapIcons/AnchorBlue.png";
import image from "../png/mapIcons/AnchorBlue.png";

type MapViewProps = {
  // googleMapApiKey:    string
  // options?:           google.maps.MapOptions
  // mapConfig:          number
  // zoom?:              number
  // center:             google.maps.LatLngLiteral
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
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // console.log(props.diveSites[0]);

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
      {/* {props.diveShops &&
        props.diveShops.map((diveShop) => {
          return <MarkerDiveShop key={diveShop.id} id={diveShop.id} latitude={diveShop.lat} longitude={diveShop.lng} />;
        })} */}

      <Marker
        key={`-site`}
        // image={image}
        title={"My Marker"}
        coordinate={{ latitude: 49.15015, longitude: -124.792317 }}
        // onClick={handleClick}
      ></Marker>
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
