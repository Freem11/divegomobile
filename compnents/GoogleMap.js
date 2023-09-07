import React, { useState, useEffect, useContext } from "react";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { TutorialContext } from "./contexts/tutorialContext";
import { MapBoundariesContext } from "./contexts/mapBoundariesContext";
import { MapRegionContext } from "./contexts/mapRegionContext";
import { MapZoomContext } from "./contexts/mapZoomContext";
import { MasterContext } from "./contexts/masterContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { AnimalMultiSelectContext } from "./contexts/animalMultiSelectContext";
import { SliderContext } from "./contexts/sliderContext";
import { AnchorModalContext } from "./contexts/anchorModalContext";
import { AnchorPhotosContext } from "./contexts/anchorPhotosContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { HeatPointsContext } from "./contexts/heatPointsContext";
import { MapHelperContext } from "./contexts/mapHelperContext"; 
import { newGPSBoundaries } from "./helpers/mapHelpers";
import { getPhotosforAnchorMulti } from "./../supabaseCalls/photoSupabaseCalls";

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
  const { mapHelper, setMapHelper } = useContext(MapHelperContext);
  const { masterSwitch } = useContext(MasterContext);
  const { mapCenter, setMapCenter } = useContext(MapCenterContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
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
  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  
  const { anchPhotos, setAnchPhotos } = useContext(AnchorPhotosContext);
  
  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      const photos = await getPhotosforAnchorMulti({
        animalMultiSelection,
        // sliderVal,
        minLat,
        maxLat,
        minLng,
        maxLng,
      });
      if (photos) {
        setAnchPhotos(photos);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };
  
  const handleMapChange = async () => {
    if (mapRef) {
      let newBoundaries = await mapRef.getMapBoundaries();

          setBoundaries([
            newBoundaries.southWest.longitude,
            newBoundaries.southWest.latitude,
            newBoundaries.northEast.longitude,
            newBoundaries.northEast.latitude,
          ]);
        

          let filteredDiveSites = await diveSites(newBoundaries);
          !diveSitesTog ? setnewSites([]) : setnewSites(filteredDiveSites);
    
          let filteredHeatPoints = await multiHeatPoints(
            newBoundaries,
            animalMultiSelection
          );
          setNewHeat(formatHeatVals(filteredHeatPoints));
    
          let zoom = calculateZoom(
            width,
            newBoundaries.northEast.longitude,
            newBoundaries.southWest.longitude
          );
          setZoomLev(zoom);
         
          try {
            
            let currentMapPosition = await mapRef.getCamera();
    
            if (currentMapPosition){
              setRegion({
                latitude: currentMapPosition.center.latitude,
                longitude: currentMapPosition.center.longitude,
                latitudeDelta:
                   newBoundaries.northEast.latitude - newBoundaries.southWest.latitude,
                longitudeDelta:
                   newBoundaries.northEast.longitude - newBoundaries.southWest.longitude,
              });
              setMapCenter({
                lat: currentMapPosition.center.latitude,
                lng: currentMapPosition.center.longitude,
              });
            }

          } catch (e) {
            console.log({ title: "Map Flipped", message: e.message });
          }
            
         

  
    }
  };

  const handleMapFlip = async () => {
    if (mapRef) {
      
          // let filteredDiveSites = await diveSites(boundaries);
          // !diveSitesTog ? setnewSites([]) : setnewSites(filteredDiveSites);
    
          // let filteredHeatPoints = await multiHeatPoints(
          //   boundaries,
          //   animalMultiSelection
          // );
          // setNewHeat(formatHeatVals(filteredHeatPoints));
    
          let zoom = calculateZoom(
            width,
            boundaries[2],
            boundaries[0]
          );
          setZoomLev(zoom);
  
          setRegion({
            latitude: mapCenter.lat,
            longitude: mapCenter.lng,
            latitudeDelta:
                boundaries[3] - boundaries[1],
            longitudeDelta:
                boundaries[2] - boundaries[0],
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
      setTempMarker([selectedDiveSite.Latitude, selectedDiveSite.Longitude]);

      setTimeout(() => {
        setTempMarker([]);
      }, 2000);
    }
  }, [selectedDiveSite]);

  useEffect(() => {
    if(mapHelper){
      handleMapFlip()
      setMapHelper(false)
    } else {
      handleMapChange();
    }
    
  }, []);

  useEffect(() => {
    handleMapChange();
  }, [diveSitesTog, sliderVal, animalSelection, animalMultiSelection]);

  useEffect(() => {
    setDragPin(mapCenter);
  }, [masterSwitch]);

  useEffect(() => {
    let zoomHelp
    if (tutorialRunning){
      zoomHelp = 8
    }

    if (mapRef) {
      mapRef.animateCamera({
        center: {
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
        },
        zoom : zoomHelp
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
    filterAnchorPhotos()
    // -----------------------------------------------------------------------------
    setSiteModal(!siteModal);
  };

  const [siteCloseState, setSiteCloseState] = useState(false);

  return (
    <View style={styles.container}>
      <MapView
        key={masterSwitch + 1}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        provider="google"
        mapType="hybrid"
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
          <Heatmap points={newHeat} radius={scale(20)} />
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
            onDragEnd={
              ((e) => {
                setDragPin({
                  lat: e.nativeEvent.coordinate.latitude,
                  lng: e.nativeEvent.coordinate.longitude,
                });
              })
            }
          />
        )}

        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
          } = cluster.properties;

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
    // flex: 1,
    // alignContent: "center",
    // alignItems: "center",
    backgroundColor: "#358BDB",
    borderRadius: 20,
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: Platform.OS === "android" ? "5%" : "10%",
    marginBottom: "5%",
    shadowOpacity: 0.2,
    shadowRadius: 50,
  },
  closeButtonAlt: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonAltPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  headerAlt: {
    // alignItems: "center",
    // alignContent: "center",
    fontFamily: "PermanentMarker_400Regular",
    color: "#F0EEEB",
    fontSize: scale(17),
    width: "73%",
    marginLeft: "13%",
    // backgroundColor: 'pink'
  },
  titleAlt: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "3%",
    width: "98%",
    height: scale(30),
    // backgroundColor: 'green'
  },
});
