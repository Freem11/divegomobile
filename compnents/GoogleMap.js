import React, { useState, useEffect, useContext, Fragment } from "react";
import { MapConfigContext } from "./contexts/mapConfigContext";
import { DiveSitesContext } from "./contexts/diveSiteToggleContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { MapBoundariesContext } from "./contexts/mapBoundariesContext";
import { MapRegionContext } from "./contexts/mapRegionContext";
import { MapZoomContext } from "./contexts/mapZoomContext";
import { PinSpotContext } from "./contexts/pinSpotContext";
import { AnimalSelectContext } from "./contexts/animalSelectContext";
import { AnimalMultiSelectContext } from "./contexts/animalMultiSelectContext";
import { AnchorPhotosContext } from "./contexts/anchorPhotosContext";
import { SelectedDiveSiteContext } from "./contexts/selectedDiveSiteContext";
import { HeatPointsContext } from "./contexts/heatPointsContext";
import { MapHelperContext } from "./contexts/mapHelperContext";
import { SelectedShopContext } from "./contexts/selectedShopContext";
import { ShopModalContext } from "./contexts/shopModalContext";
import { SitesArrayContext } from "./contexts/sitesArrayContext";
import { ZoomHelperContext } from "./contexts/zoomHelperContext";
import { PullTabContext } from "./contexts/pullTabContext";
import { CarrouselTilesContext } from "./contexts/carrouselTilesContext";
import { newGPSBoundaries } from "./helpers/mapHelpers";
import {
  getPhotosWithUser,
  getPhotosWithUserEmpty,
} from "./../supabaseCalls/photoSupabaseCalls";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Heatmap,
  Callout,
} from "react-native-maps";
import { StyleSheet, View, Dimensions, Platform, Text } from "react-native";
import mantaIOS from "../compnents/png/mapIcons/Manta_60.png";
import anchorGold from "../compnents/png/mapIcons/AnchorGold.png";
import anchorClustIOS from "../compnents/png/mapIcons/AnchorCluster.png";
import anchorIconIOS from "../compnents/png/mapIcons/AnchorBlue.png";
import shopClustIOS from "../compnents/png/mapIcons/DiveCentre60x60.png";
import { calculateZoom, formatHeatVals } from "./helpers/mapHelpers";
import { setupClusters, setupShopClusters } from "./helpers/clusterHelpers";
import useSupercluster from "use-supercluster";
import {
  getDiveSitesWithUser,
  getSingleDiveSiteByNameAndRegion,
} from "../supabaseCalls/diveSiteSupabaseCalls";
import {
  getHeatPointsWithUser,
  getHeatPointsWithUserEmpty,
} from "../supabaseCalls/heatPointSupabaseCalls";
import { getItineraryDiveSiteByIdArray } from "../supabaseCalls/itinerarySupabaseCalls";
import { shops, getShopByName } from "../supabaseCalls/shopsSupabaseCalls";
import { moderateScale } from "react-native-size-matters";
import { useButtonPressHelper } from "./FABMenu/buttonPressHelper";
import * as ScreenOrientation from "expo-screen-orientation";
import { UserProfileContext } from "./contexts/userProfileContext";
import { PreviousButtonIDContext } from "./contexts/previousButtonIDContext";
import { ActiveScreenContext } from "./contexts/activeScreenContext";
import { LevelOneScreenContext } from "./contexts/levelOneScreenContext";
import { TripSitesContext } from "./contexts/tripSitesContext";
import { TripDetailContext } from "./contexts/tripDetailsContext";
import { activeFonts } from "./styles";

const { width } = Dimensions.get("window");

export default function Map() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const { mapConfig } = useContext(MapConfigContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { setTripDiveSites } = useContext(TripSitesContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);
  const { mapHelper, setMapHelper } = useContext(MapHelperContext);
  const { mapCenter } = useContext(MapCenterContext);
  const { region, setRegion } = useContext(MapRegionContext);
  const { boundaries, setBoundaries } = useContext(MapBoundariesContext);
  const { zoomlev, setZoomLev } = useContext(MapZoomContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);
  const { diveSitesTog } = useContext(DiveSitesContext);
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
  const { selectedShop, setSelectedShop } = useContext(SelectedShopContext);
  const { shopModal } = useContext(ShopModalContext);
  const { setAnchPhotos } = useContext(AnchorPhotosContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { profile } = useContext(UserProfileContext);
  const { setShowFilterer } = useContext(PullTabContext);
  const { setTiles } = useContext(CarrouselTilesContext);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      let photos;
      if (animalMultiSelection.length === 0) {
        photos = await getPhotosWithUserEmpty({
          userId: profile[0].UserID,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      } else {
        photos = await getPhotosWithUser({
          animalMultiSelection,
          userId: profile[0].UserID,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      }
      if (photos) {
        setAnchPhotos(photos);
      }
    } catch (e) {
      console.log({ title: "Error99", message: e.message });
    }
  };

  const handleMapChange = async () => {
    if (mapRef) {
      let newBoundaries = await mapRef.getMapBoundaries();

      let settedBoundaries = [
        newBoundaries.southWest.longitude,
        newBoundaries.southWest.latitude,
        newBoundaries.northEast.longitude,
        newBoundaries.northEast.latitude,
      ];
      setBoundaries(settedBoundaries);

      if (settedBoundaries) {
        if (settedBoundaries[0] > settedBoundaries[2]) {
          try {
            let AmericanDiveSites;
            let AsianDiveSites;
            AmericanDiveSites = await getDiveSitesWithUser({
              minLat: settedBoundaries[1],
              maxLat: settedBoundaries[3],
              minLng: -180,
              maxLng: settedBoundaries[2],
            });
            AsianDiveSites = await getDiveSitesWithUser({
              minLat: settedBoundaries[1],
              maxLat: settedBoundaries[3],
              minLng: settedBoundaries[0],
              maxLng: 180,
            });

            let diveSiteList = [...AsianDiveSites, ...AmericanDiveSites];
            !diveSitesTog ? setnewSites([]) : setnewSites(diveSiteList);
          } catch (e) {
            console.log({ title: "Error21", message: e.message });
          }

          try {
            let AmericanHeatPoints;
            let AsianHeatPoints;
            if (animalMultiSelection.length === 0) {
              AmericanHeatPoints = await getHeatPointsWithUserEmpty({
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: -180,
                maxLng: settedBoundaries[2],
              });
              AsianHeatPoints = await getHeatPointsWithUserEmpty({
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: settedBoundaries[0],
                maxLng: 180,
              });
            } else {
              AmericanHeatPoints = await getHeatPointsWithUser({
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: -180,
                maxLng: settedBoundaries[2],
                animalMultiSelection,
              });
              AsianHeatPoints = await getHeatPointsWithUser({
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: settedBoundaries[0],
                maxLng: 180,
                animalMultiSelection,
              });
            }

            let heatPointList = [...AsianHeatPoints, ...AmericanHeatPoints];
            setNewHeat(formatHeatVals(heatPointList));
          } catch (e) {
            console.log({ title: "Error88", message: e.message });
          }
        } else {
          try {
            const diveSiteList = await getDiveSitesWithUser({
              minLat: settedBoundaries[1],
              maxLat: settedBoundaries[3],
              minLng: settedBoundaries[0],
              maxLng: settedBoundaries[2],
            });

            !diveSitesTog ? setnewSites([]) : setnewSites(diveSiteList);
          } catch (e) {
            console.log({ title: "Error32", message: e.message });
          }

          try {
            let heatPointList;
            if (animalMultiSelection.length === 0) {
              heatPointList = await getHeatPointsWithUserEmpty({
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: settedBoundaries[0],
                maxLng: settedBoundaries[2],
              });
            } else {
              heatPointList = await getHeatPointsWithUser({
                animalMultiSelection,
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: settedBoundaries[0],
                maxLng: settedBoundaries[2],
              });
            }
            setNewHeat(formatHeatVals(heatPointList));
          } catch (e) {
            console.log({ title: "Error77", message: e.message });
          }
        }
      }

      let filteredShops = await shops(newBoundaries);
      !diveSitesTog ? setnewShops([]) : setnewShops(filteredShops);

      let zoom = calculateZoom(
        width,
        newBoundaries.northEast.longitude,
        newBoundaries.southWest.longitude
      );
      setZoomLev(zoom);

      try {
        if (mapRef) {
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
          }
        }
      } catch (e) {
        console.log({ title: "Map Flipped", message: e.message });
      }
    }
  };

  const updateMapCenter = async () => {
    handleMapChange();
    if (mapRef) {
      let currentMapPosition = await mapRef.getCamera();
      if (currentMapPosition) {
        // if(mapConfig === 1){
        //   setDragPin({
        //     lat: currentMapPosition.center.latitude,
        //     lng: currentMapPosition.center.longitude,
        //   });
        // }
      }
    }
  };

  const handleMapFlip = async () => {
    if (mapRef) {
      let zoom = calculateZoom(width, boundaries[2], boundaries[0]);
      setZoomLev(zoom);

      await setRegion({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        latitudeDelta: boundaries[3] - boundaries[1],
        longitudeDelta: boundaries[2] - boundaries[0],
      });
    }
  };

  useEffect(() => {
    if (mapRef) {
      if (selectedDiveSite.Latitude) {
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
    }
  }, [selectedDiveSite]);

  useEffect(() => {
    if (mapRef) {
      if (selectedShop[0]) {
        mapRef.animateCamera({
          center: {
            latitude: selectedShop[0].lat,
            longitude: selectedShop[0].lng,
          },
          zoom: 16,
        });
      }
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
  }, [diveSitesTog, animalSelection, animalMultiSelection, mapCenter]);

  const handleDragPin = async () => {
    if (mapRef) {
      let currentMapPosition = await mapRef.getCamera();
      if (currentMapPosition) {
        if (mapConfig === 1) {
          setDragPin({
            lat: currentMapPosition.center.latitude,
            lng: currentMapPosition.center.longitude,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (mapConfig === 1) {
      handleDragPin();
    }
    if (mapConfig === 0) {
      // setSitesArray([])
    }
  }, [mapConfig]);

  useEffect(() => {
    let zoomHelp;

    if (zoomHelper) {
      if (shopModal) {
        zoomHelp = 16;
      } else if (!shopModal) {
        zoomHelp = 12;
      }
      setZoomHelper(false);
    }

    if (tempMarker.length === 0) {
      if (mapRef) {
        mapRef.animateCamera({
          center: {
            latitude: mapCenter.lat,
            longitude: mapCenter.lng,
          },
          zoom: zoomHelp,
        });
      }
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
  let sitePoints = setupClusters(newSites, sitesArray);
  const points = sitePoints;

  mapConfig === 0
    ? shopPoints.forEach((entity) => {
        points.push(entity);
      })
    : [];

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: boundaries,
    zoom: zoomlev,
    options: { radius: 75, maxZoom: 16, minZoom: 3 },
  });

  const setupAnchorModal = async(id, diveSiteName, lat, lng) => {
    const cleanedSiteName = diveSiteName.split('~');
    const steName = cleanedSiteName[0]
    const siteRegion = cleanedSiteName[1] === "null" ? null : cleanedSiteName[1]
    const chosenSite = await getSingleDiveSiteByNameAndRegion({name: steName, region: siteRegion})
    if(chosenSite){
      setSelectedDiveSite(chosenSite[0]);
    }


    setTiles(true);
    setShowFilterer(false);
    filterAnchorPhotos();
    setPreviousButtonID(activeScreen);
    setActiveScreen("DiveSiteScreen");
    useButtonPressHelper(
      "DiveSiteScreen",
      activeScreen,
      levelOneScreen,
      setLevelOneScreen
    );
  };

  const setupShopModal = async (shopName) => {
    let chosenShop = await getShopByName(shopName);
    setTiles(true);
    setShowFilterer(false);
    setSelectedShop(chosenShop);
    setPreviousButtonID(activeScreen);
    setActiveScreen("DiveShopScreen");
    useButtonPressHelper(
      "DiveShopScreen",
      activeScreen,
      levelOneScreen,
      setLevelOneScreen
    );
  };
  const getTripDiveSites = async (siteIds) => {
    try {
      const success = await getItineraryDiveSiteByIdArray(siteIds);
      if (success) {
        setTripDiveSites(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    setFormValues({ ...formValues, siteList: sitesArray });
    getTripDiveSites(sitesArray);
    setTripDiveSites(getTripDiveSites(sitesArray));
  }, [sitesArray.length]);

  const addToSitesArray = async (siteName) => {
    let splitNames = siteName.split("~");
    let grabbedSite = await getSingleDiveSiteByNameAndRegion({
      name: splitNames[0],
      region: splitNames[1],
    });

    sitesArray.push(grabbedSite[0].id);
    setSitesArray(sitesArray);
    handleMapChange();
  };

  const removeFromSitesArray = async (siteName) => {
    let splitNames = siteName.split("~");
    let grabbedSite = await getSingleDiveSiteByNameAndRegion({
      name: splitNames[0],
      region: splitNames[1],
    });
    const index = sitesArray.indexOf(grabbedSite[0].id);
    if (index > -1) {
      sitesArray.splice(index, 1);
    }
    setSitesArray(sitesArray);
    handleMapChange();
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
        ref={(ref) => setMapRef(ref)}
        onMapReady={() => handleMapChange()}
        onRegionChangeComplete={() => updateMapCenter()}
        toolbarEnabled={false}
      >
        {mapConfig in [0, , 2] && newHeat.length > 0 && (
          <Heatmap points={newHeat} radius={Platform.OS === "ios" ? 30 : 10} />
        )}

        {tempMarker.length > 0 && (
          <Marker
            key={"temp"}
            coordinate={{
              latitude: tempMarker[0],
              longitude: tempMarker[1],
            }}
            image={anchorGold}
          />
        )}

        {mapConfig === 1 ? (
          <Marker
            key={"drag"}
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
        ) : null}

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
                key={`${cluster.properties.siteID}-blue`}
                coordinate={{ latitude: latitude, longitude: longitude }}
                image={anchorIconIOS}
                onPress={() =>
                  mapConfig === 3
                    ? addToSitesArray(cluster.properties.siteID)
                    : mapConfig === 1
                    ? null
                    : setupAnchorModal(
                        cluster,
                        cluster.properties.siteID,
                        latitude,
                        longitude
                      )
                }
              >
                {mapConfig in [, 1, , 3] ? (
                  <Callout tooltip>
                    <View
                      style={{
                        marginBottom: moderateScale(5),
                        backgroundColor: "#538bdb",
                        padding: moderateScale(3),
                        paddingLeft: moderateScale(10),
                        paddingRight: moderateScale(10),
                        borderRadius: moderateScale(20),
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: activeFonts.Thin,
                          fontSize: moderateScale(18),
                        }}
                      >
                        {cluster.properties.siteName}
                      </Text>
                    </View>
                  </Callout>
                ) : (
                  <Callout tooltip>
                    <View style={{ backgroundColor: "transparent" }}></View>
                  </Callout>
                )}
              </Marker>
            );
          } else if (cluster.properties.category === "Dive Site Selected") {
            return (
              <Marker
                key={`${cluster.properties.siteID}-gold`}
                coordinate={{ latitude: latitude, longitude: longitude }}
                image={anchorGold}
                onPress={() =>
                  mapConfig === 3
                    ? removeFromSitesArray(cluster.properties.siteID)
                    : setupAnchorModal(
                        cluster.properties.id,
                        cluster.properties.siteID,
                        latitude,
                        longitude
                      )
                }
              ></Marker>
            );
          } else {
            return mapConfig === 0 ? (
              <Marker
                key={`${cluster.properties.siteID}-shop`}
                coordinate={{ latitude: latitude, longitude: longitude }}
                image={shopClustIOS}
                onPress={() => setupShopModal(cluster.properties.siteID)}
              ></Marker>
            ) : (
              <Fragment key={cluster.properties.siteID} />
            );
          }
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
    height: "100%",
  },
});
