import React, { useState, useEffect, useContext, Fragment } from "react";
import { MapConfigContext } from "./contexts/mapConfigContext";
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
import { DiveSiteSearchModalContext } from "./contexts/diveSiteSearchContext";
import { MapSearchModalContext } from "./contexts/mapSearchContext";
import { DSAdderContext } from "./contexts/DSModalContext";
import { PictureAdderContext } from "./contexts/picModalContext";
import { TutorialLaunchPadContext } from "./contexts/tutorialLaunchPadContext";
import { ProfileModalContext } from "./contexts/profileModalContext";
import { SettingsContext } from "./contexts/gearModalContext";
import { PullTabContext } from "./contexts/pullTabContext";
import { CarrouselTilesContext } from "./contexts/carrouselTilesContext";
import { CommentsModalContext } from "./contexts/commentsModalContext";
import { SelectedPictureContext } from "./contexts/selectedPictureContext";
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
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Keyboard,
  Text,
  Alert,
} from "react-native";
import mantaIOS from "../compnents/png/mapIcons/Manta_60.png";
import anchorGold from "../compnents/png/mapIcons/AnchorGold.png";
import anchorClustIOS from "../compnents/png/mapIcons/AnchorCluster.png";
import anchorIconIOS from "../compnents/png/mapIcons/AnchorBlue.png";
// import shopIOS from "../compnents/png/scuba.png";
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
import { shops, getShopByName } from "../supabaseCalls/shopsSupabaseCalls";
import { moderateScale, scale } from "react-native-size-matters";
import { useButtonPressHelper } from "./FABMenu/buttonPressHelper";
import * as ScreenOrientation from "expo-screen-orientation";
import { UserProfileContext } from "./contexts/userProfileContext";
import { ActiveButtonIDContext } from "./contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "./contexts/previousButtonIDContext";
import { ActiveScreenContext } from './contexts/activeScreenContext';
import { LevelOneScreenContext } from './contexts/levelOneScreenContext';

import { LargeModalContext } from "./contexts/largeModalContext";
import { FullScreenModalContext } from "./contexts/fullScreenModalContext";
import { ActiveTutorialIDContext } from "./contexts/activeTutorialIDContext";

const { width, height } = Dimensions.get("window");

export default function Map() {
  if (Platform.OS === "ios") {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }
  const { mapConfig, setMapConfig } = useContext(MapConfigContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { activeScreen, setActiveScreen } = useContext(
    ActiveScreenContext
    );

  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { activeTutorialID, setActiveTutorialID } = useContext(
    ActiveTutorialIDContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { fullScreenModal, setFullScreenModal } = useContext(
    FullScreenModalContext
  );

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
  const { setCommentsModal } = useContext(CommentsModalContext);
  const { setSelectedPicture } = useContext(SelectedPictureContext);

  const { shopModal, setShopModal } = useContext(ShopModalContext);

  const { anchPhotos, setAnchPhotos } = useContext(AnchorPhotosContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const { gearModal, setGearModal } = useContext(SettingsContext);
  const { profileModal, setProfileModal } = useContext(ProfileModalContext);
  const { mapSearchModal, setMapSearchModal } = useContext(
    MapSearchModalContext
  );
  const { diveSiteSearchModal, setDiveSiteSearchModal } = useContext(
    DiveSiteSearchModalContext
  );
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);
  const { diveSiteAdderModal, setDiveSiteAdderModal } =
    useContext(DSAdderContext);
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );
  const { profile } = useContext(UserProfileContext);
  const { showFilterer, setShowFilterer } = useContext(PullTabContext);
  const { tiles, setTiles } = useContext(CarrouselTilesContext);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      let photos;
      if (animalMultiSelection.length === 0) {
        photos = await getPhotosWithUserEmpty({
          myCreatures,
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
          myCreatures,
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
              myDiveSites,
              minLat: settedBoundaries[1],
              maxLat: settedBoundaries[3],
              minLng: -180,
              maxLng: settedBoundaries[2],
            });
            AsianDiveSites = await getDiveSitesWithUser({
              myDiveSites,
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
                myCreatures,
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: -180,
                maxLng: settedBoundaries[2],
              });
              AsianHeatPoints = await getHeatPointsWithUserEmpty({
                myCreatures,
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: settedBoundaries[0],
                maxLng: 180,
              });
            } else {
              AmericanHeatPoints = await getHeatPointsWithUser({
                myCreatures,
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: -180,
                maxLng: settedBoundaries[2],
                animalMultiSelection,
              });
              AsianHeatPoints = await getHeatPointsWithUser({
                myCreatures,
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
              myDiveSites,
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
                myCreatures,
                minLat: settedBoundaries[1],
                maxLat: settedBoundaries[3],
                minLng: settedBoundaries[0],
                maxLng: settedBoundaries[2],
              });
            } else {
              heatPointList = await getHeatPointsWithUser({
                animalMultiSelection,
                myCreatures,
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
        setMapCenter({
          lat: currentMapPosition.center.latitude,
          lng: currentMapPosition.center.longitude,
        });
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
    if (shopModal) {
      return;
    }
    updateMapCenter();
  }, [siteModal, diveSiteAdderModal, diveSiteSearchModal, picAdderModal]);

  useEffect(() => {
    handleMapChange();
  }, [
    diveSitesTog,
    sliderVal,
    animalSelection,
    animalMultiSelection,
    mapCenter,
  ]);

  useEffect(() => {
    if (mapConfig === 1) {
      setDragPin(mapCenter);
    }
  }, [mapConfig]);

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

    if (zoomHelper) {
      if (shopModal) {
        zoomHelp = 16;
        setMinorSwitch(true);
      } else if (!shopModal) {
        zoomHelp = 12;
        setMinorSwitch(false);
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

  const setupAnchorModal = (diveSiteName, lat, lng) => {
    setSelectedDiveSite({
      SiteName: diveSiteName,
      Latitude: lat,
      Longitude: lng,
    });
    setTiles(true);
    setShowFilterer(false);
    filterAnchorPhotos();
    setPreviousButtonID(activeButtonID);
    setActiveScreen("DiveSiteScreen")
    useButtonPressHelper(
      "DiveSiteScreen",
      activeScreen,
      levelOneScreen,
      setLevelOneScreen
    );
    if (itterator3 === 5) {
      setItterator3(itterator3 + 1);
    }
  };

  const setupShopModal = async (shopName) => {
    let chosenShop = await getShopByName(shopName);
    setTiles(true);
    setShowFilterer(false);
    setSelectedShop(chosenShop);
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("ShopMaskIcon");
    useButtonPressHelper(
      "ShopMaskIcon",
      activeButtonID,
      largeModal,
      setLargeModal
    );
  };

  const clearModals = async () => {
    Keyboard.dismiss();
    setGearModal(false);
    setProfileModal(false);
    setMapSearchModal(false);
    setDiveSiteSearchModal(false);
    setPicAdderModal(false);
    setDiveSiteAdderModal(false);
    setTutorialLaunchpadModal(false);
    setCommentsModal(false);
    setTiles(true);
    setSelectedPicture(null);
  };

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
        onPress={clearModals}
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
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

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
                        cluster.properties.siteName,
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
                          fontFamily: "Itim_400Regular",
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
                        cluster.properties.siteName,
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
