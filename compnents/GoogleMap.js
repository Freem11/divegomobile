import React, { useState, useEffect, useContext } from "react";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { MapBoundariesContext } from "./contexts/mapBoundariesContext";
import { MapRegionContext } from "./contexts/mapRegionContext";
import { MapZoomContext } from "./contexts/mapZoomContext";
import { MasterContext } from "./contexts/masterContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { AnimalMultiSelectContext } from "./contexts/animalMultiSelectContext";
import { SliderContext } from "./contexts/sliderContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { HeatPointsContext } from "./contexts/heatPointsContext";
import MapView, { PROVIDER_GOOGLE, Marker, Heatmap } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Keyboard,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import mantaIOS from "../compnents/png/Manta32.png";
import anchorGold from "../compnents/png/icons8-anchor-24.png";
import anchorClustIOS from "../compnents/png/ClusterAnchor24.png";
import anchorIconIOS from "../compnents/png/SiteAnchor20.png";
import { calculateZoom, formatHeatVals } from "./helpers/mapHelpers";
import { setupClusters } from "./helpers/clusterHelpers";
import useSupercluster from "use-supercluster";
import { diveSites } from "../supabaseCalls/diveSiteSupabaseCalls";
import { multiHeatPoints } from "../supabaseCalls/heatPointSupabaseCalls";
import AnchorModal from "./modals/anchorModal";
import { scale } from "react-native-size-matters";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Map() {
  const { masterSwitch } = useContext(MasterContext);
  const { mapCenter, setMapCenter } = useContext(MapCenterContext);
  const { region, setRegion } = useContext(MapRegionContext);
  const { boundaries, setBoundaries } = useContext(MapBoundariesContext);
  const { zoomlev, setZoomLev } = useContext(MapZoomContext);
  const { diveSitesTog } = useContext(DiveSitesContext);
  const { sliderVal } = useContext(SliderContext);
  const { animalSelection } = useContext(AnimalSelectContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { dragPin, setDragPin } = useContext(PinSpotContext);
  const { selectedDiveSite, setSelectedDiveSite } = useContext(
    SelectedDiveSiteContext
  );
  const { newHeat, setNewHeat } = useContext(HeatPointsContext);

  const [tempMarker, setTempMarker] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [newSites, setnewSites] = useState([]);
  const [siteModal, setSiteModal] = useState(false);

  const handleMapChange = async () => {
    if (mapRef) {
      let boundaries = await mapRef.getMapBoundaries();
      setBoundaries([
        boundaries.southWest.longitude,
        boundaries.southWest.latitude,
        boundaries.northEast.longitude,
        boundaries.northEast.latitude,
      ]);

      let filteredDiveSites = await diveSites(boundaries);
      !diveSitesTog ? setnewSites([]) : setnewSites(filteredDiveSites);

      let filteredHeatPoints = await multiHeatPoints(
        boundaries,
        animalMultiSelection
      );
      setNewHeat(formatHeatVals(filteredHeatPoints));

      let zoom = calculateZoom(
        width,
        boundaries.northEast.longitude,
        boundaries.southWest.longitude
      );
      setZoomLev(zoom);

      let currentMapPosition = await mapRef.getCamera();
      setRegion({
        latitude: currentMapPosition.center.latitude,
        longitude: currentMapPosition.center.longitude,
        latitudeDelta:
          boundaries.northEast.latitude - boundaries.southWest.latitude,
        longitudeDelta:
          boundaries.northEast.longitude - boundaries.southWest.longitude,
      });

      setMapCenter({
        lat: currentMapPosition.center.latitude,
        lng: currentMapPosition.center.longitude,
      });
    }
  };

  useEffect(() => {
    if (mapRef) {
      mapRef.animateCamera({
        center: {
          latitude: selectedDiveSite.Latitude,
          longitude: selectedDiveSite.Longitude,
        },
        zoom: 12,
      });
      setTempMarker([selectedDiveSite.Latitude, selectedDiveSite.Longitude])

      setTimeout(() => {
        setTempMarker([])
      }, 2000)
      
    }
  }, [selectedDiveSite]);

  useEffect(() => {
    handleMapChange();
  }, []);

  useEffect(() => {
    handleMapChange();
  }, [diveSitesTog, sliderVal, animalSelection, animalMultiSelection]);

  useEffect(() => {
    setDragPin(mapCenter);
  }, [masterSwitch]);

  useEffect(() => {
    if (mapRef) {
      mapRef.animateCamera({
        center: {
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
        },
      });
      Keyboard.dismiss();
    }
  }, [mapCenter]);

  let zoomier = calculateZoom(width, boundaries[2], boundaries[0]);

  if (mapRef && zoomier < 2) {
    mapRef.animateCamera({
      center: { latitude: mapCenter.lat, longitude: mapCenter.lng },
      zoom: 2,
    });
  }

  const points = setupClusters(newSites);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: boundaries,
    zoom: zoomlev,
    options: { radius: 75, maxZoom: 16, minZoom: 3 },
  });

  const setupAnchorModal = (diveSiteName, lat, lng) => {
    setSelectedDiveSite({
      SiteName: diveSiteName,
      Latitude: lat,
      Longitude: lng,
    });
    setSiteModal(!siteModal);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        provider="google"
        mapType="satellite"
        initialRegion={region}
        mapType={"satellite"}
        maxZoomLevel={16}
        minZoomLevel={1}
        ref={(ref) => setMapRef(ref)}
        onMapReady={() => handleMapChange()}
        onRegionChangeComplete={() => handleMapChange()}
        toolbarEnabled={false}
      >
        {masterSwitch && newHeat.length > 0 && (
          <Heatmap points={newHeat} radius={20} />
        )}

        {tempMarker.length > 0 && (
             <Marker
             coordinate={{
               latitude: tempMarker[0],
               longitude: tempMarker[1],
             }}
             image={anchorGold}
           />
        )}

        {!masterSwitch && (
          <Marker
            draggable={true}
            coordinate={{
              latitude: dragPin.lat,
              longitude: dragPin.lng,
            }}
            image={mantaIOS}
            onDragEnd={(e) => {
              setDragPin({
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude,
              });
            }}
          />
        )}

        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={cluster.id}
                coordinate={{ latitude: latitude, longitude: longitude }}
                // title={pointCount.toString() + " sites"}
                image={anchorClustIOS}
                onPress={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    16
                  );
                  mapRef.animateCamera({
                    center: { latitude, longitude },
                    zoom: expansionZoom,
                  });
                }}
              ></Marker>
            );
          }
          return (
            <Marker
              key={cluster.properties.siteID}
              coordinate={{ latitude: latitude, longitude: longitude }}
              image={anchorIconIOS}
              // title={cluster.properties.siteID}
              onPress={() =>
                setupAnchorModal(cluster.properties.siteID, latitude, longitude)
              }
            ></Marker>
          );
        })}
      </MapView>

      <Modal visible={siteModal} animationType="slide" transparent={true}>
        <View style={styles.modalStyle}>
          <View style={styles.titleAlt}>
            <View>
              <Text style={styles.headerAlt}>{selectedDiveSite.SiteName}</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => setSiteModal(!siteModal)}>
              <View style={styles.closeButtonAlt}>
                <FontAwesome name="close" color="#BD9F9F" size={28} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <AnchorModal 
          SiteName={selectedDiveSite.SiteName}
          Lat={selectedDiveSite.Latitude}
          Lng={selectedDiveSite.Longitude}
            />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  modalStyle: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#358BDB",
    borderRadius: 20,
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: Platform.OS === "android" ? "5%" : "15%",
    marginBottom: "5%",
    shadowOpacity: 0.2,
    shadowRadius: 50,
  },
  closeButtonAlt: {
    position: "absolute",
    borderRadius: scale(42 / 2),
    height: 42,
    width: 42,
    top: scale(-5),
    right: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerAlt: {
    alignItems: "center",
    alignContent: "center",
    fontFamily: "PermanentMarker_400Regular",
    color: "#F0EEEB",
    fontSize: scale(17),
    marginTop: scale(56),
    width: scale(180),
    textAlign: "left",
    height: scale(100),
  },
  titleAlt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: scale(20),
    width: "100%",
    height: 50,
  },
});
