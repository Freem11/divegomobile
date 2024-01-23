import React, { useState, useEffect, useContext } from "react";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { TutorialContext } from "./contexts/tutorialContext";
import { IterratorContext } from "./contexts/iterratorContext";
import { Iterrator2Context } from "./contexts/iterrator2Context";
import { Iterrator3Context } from "./contexts/iterrator3Context";
import { MapBoundariesContext } from "./contexts/mapBoundariesContext";
import { MapRegionContext } from "./contexts/mapRegionContext";
import { MapZoomContext } from "./contexts/mapZoomContext";
import { MasterContext } from "./contexts/masterContext";
import { MinorContext } from "./contexts/minorContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { AnimalMultiSelectContext } from "./contexts/animalMultiSelectContext";
import { SliderContext } from "./contexts/sliderContext";
import { AnchorModalContext } from "./contexts/anchorModalContext";
import { AnchorPhotosContext } from "./contexts/anchorPhotosContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { HeatPointsContext } from "./contexts/heatPointsContext";
import { MapHelperContext } from "./contexts/mapHelperContext";
import { MyCreaturesContext } from "./contexts/myCreaturesContext";
import { MyDiveSitesContext } from "./contexts/myDiveSitesContext";
import { SelectedShopContext } from "./contexts/selectedShopContext";
import { ShopModalContext } from "./contexts/shopModalContext";
import { SitesArrayContext } from "./contexts/sitesArrayContext";
import { ZoomHelperContext } from "./contexts/zoomHelperContext";
import { newGPSBoundaries } from "./helpers/mapHelpers";
import { getPhotosforAnchorMulti } from "./../supabaseCalls/photoSupabaseCalls";
import MapView, { PROVIDER_GOOGLE, Marker, Heatmap } from "react-native-maps";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import mantaIOS from "../compnents/png/Manta32.png";
import anchorGold from "../compnents/png/markerAnchor48.png";
import anchorClustIOS from "../compnents/png/ClusterAnchor24.png";
import anchorIconIOS from "../compnents/png/SiteAnchor20.png";
import shopIOS from "../compnents/png/scuba.png";
import shopClustIOS from "../compnents/png/face-mask.png";
import { calculateZoom, formatHeatVals } from "./helpers/mapHelpers";
import { setupClusters, setupShopClusters } from "./helpers/clusterHelpers";
import useSupercluster from "use-supercluster";
import { diveSites } from "../supabaseCalls/diveSiteSupabaseCalls";
import { multiHeatPoints } from "../supabaseCalls/heatPointSupabaseCalls";
import { shops, getShopByName } from "../supabaseCalls/shopsSupabaseCalls";
import { scale } from "react-native-size-matters";
import * as ScreenOrientation from "expo-screen-orientation";

const { width, height } = Dimensions.get("window");

export default function Map() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const { myCreatures, setMyCreatures } = useContext(MyCreaturesContext);
  const { myDiveSites, setMyDiveSites } = useContext(MyDiveSitesContext);
  const { mapHelper, setMapHelper } = useContext(MapHelperContext);
  const { masterSwitch } = useContext(MasterContext);
  const { minorSwitch, setMinorSwitch } = useContext(MinorContext);
  const { mapCenter, setMapCenter } = useContext(MapCenterContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { region, setRegion } = useContext(MapRegionContext);
  const { boundaries, setBoundaries } = useContext(MapBoundariesContext);
  const { zoomlev, setZoomLev } = useContext(MapZoomContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);
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
  const [newShops, setnewShops] = useState([]);
  const { siteModal, setSiteModal } = useContext(AnchorModalContext);

  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const { shopModal, setShopModal } = useContext(ShopModalContext);

  const { anchPhotos, setAnchPhotos } = useContext(AnchorPhotosContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

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

      let filteredShops = await shops(newBoundaries);
      !diveSitesTog ? setnewShops([]) : setnewShops(filteredShops);

      let filteredDiveSites = await diveSites(newBoundaries, myDiveSites);
      !diveSitesTog ? setnewSites([]) : setnewSites(filteredDiveSites);

      let filteredHeatPoints = await multiHeatPoints(
        newBoundaries,
        animalMultiSelection,
        myCreatures
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

        if (currentMapPosition) {
          setRegion({
            latitude: currentMapPosition.center.latitude,
            longitude: currentMapPosition.center.longitude,
            latitudeDelta:
              newBoundaries.northEast.latitude -
              newBoundaries.southWest.latitude,
            longitudeDelta:
              newBoundaries.northEast.longitude -
              newBoundaries.southWest.longitude,
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

      let zoom = calculateZoom(width, boundaries[2], boundaries[0]);
      setZoomLev(zoom);

      setRegion({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        latitudeDelta: boundaries[3] - boundaries[1],
        longitudeDelta: boundaries[2] - boundaries[0],
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
        zoom: 16,
      });
      setTempMarker([selectedDiveSite.Latitude, selectedDiveSite.Longitude]);

      setTimeout(() => {
        setTempMarker([]);
      }, 2000);
    }
  }, [selectedDiveSite]);

  useEffect(() => {
    if (mapRef) {
      mapRef.animateCamera({
        center: {
          latitude: selectedShop[0].lat,
          longitude: selectedShop[0].lng,
        },
        zoom: 16,
      });
    }
  }, [selectedShop]);

  useEffect(() => {
    if (mapHelper) {
      handleMapFlip();
      setMapHelper(false);
    } else {
      handleMapChange();
    }
  }, []);

  useEffect(() => {
    handleMapChange();
  }, [diveSitesTog, sliderVal, animalSelection, animalMultiSelection]);

  useEffect(() => {
    if (minorSwitch){
      setDragPin(mapCenter);
    } 
  }, [masterSwitch]);

  useEffect(() => {
    let zoomHelp;
    if (
      (tutorialRunning && itterator === 7) ||
      itterator === 9 ||
      itterator === 10 ||
      itterator === 16
    ) {
      zoomHelp = 8;
    } else if (tutorialRunning && itterator === 12) {
      zoomHelp = 12;
    } else if (tutorialRunning && itterator2 === 2) {
      zoomHelp = 8;
    } else if (tutorialRunning && itterator2 === 10) {
      zoomHelp = 10;
    } else if (tutorialRunning && itterator3 === 15) {
      zoomHelp = 10;
    }

    if(zoomHelper){
      if(shopModal){
        zoomHelp = 16
      } else {
        zoomHelp = 12
      }
      setZoomHelper(false)
      setMinorSwitch(false)
    }

    if (mapRef) {
      mapRef.animateCamera({
        center: {
          latitude: mapCenter.lat,
          longitude: mapCenter.lng,
        },
        zoom: zoomHelp,
      });
      // Keyboard.dismiss();
    }
  }, [mapCenter]);

  let zoomier = calculateZoom(width, boundaries[2], boundaries[0]);

  if (mapRef && zoomier < 2) {
    mapRef.animateCamera({
      center: { latitude: mapCenter.lat, longitude: mapCenter.lng },
      zoom: 2,
    });
  }

  const shopPoints = setupShopClusters(newShops);
  const sitePoints = setupClusters(newSites, sitesArray);
  const points = sitePoints;

  shopPoints.forEach((entity) => {
    points.push(entity);
  });

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
    filterAnchorPhotos();
    setSiteModal(true);
  };

  const setupShopModal = async (shopName) => {
    let chosenShop = await getShopByName(shopName);
    setSelectedShop(chosenShop);
    setShopModal(true);
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
          <Heatmap points={newHeat} radius={Platform.OS === "ios" ? 30 : 10} />
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
          const {
            cluster: isCluster,
            point_count: pointCount,
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={cluster.id}
                coordinate={{ latitude: latitude, longitude: longitude }}
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
          if (cluster.properties.category === "Dive Site") {
            return (
              <Marker
                key={cluster.properties.siteID}
                coordinate={{ latitude: latitude, longitude: longitude }}
                image={anchorIconIOS}
                onPress={() =>
                  setupAnchorModal(
                    cluster.properties.siteID,
                    latitude,
                    longitude
                  )
                }
              ></Marker>
            );
          } else if (cluster.properties.category === "Dive Site Selected") {
            return (
              <Marker
                key={cluster.properties.siteID}
                coordinate={{ latitude: latitude, longitude: longitude }}
                image={anchorGold}
                onPress={() =>
                  setupAnchorModal(
                    cluster.properties.siteID,
                    latitude,
                    longitude
                  )
                }
              ></Marker>
            );
          } else {
            return (
              <Marker
                key={cluster.properties.siteID}
                coordinate={{ latitude: latitude, longitude: longitude }}
                image={shopClustIOS}
                onPress={() => setupShopModal(cluster.properties.siteID)}
              ></Marker>
            );
          }
        })}

        {/* {shopClusters.map((cluster) => {
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
                image={shopClustIOS}
                onPress={() => {
                  const expansionZoom = Math.min(
                    supercluster2.getClusterExpansionZoom(cluster.id),
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
              image={shopIOS}
              // onPress={() =>
              //   setupAnchorModal(cluster.properties.siteID, latitude, longitude)
              // }
            ></Marker>
          );
        })} */}
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
