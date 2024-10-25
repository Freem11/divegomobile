import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { openURL } from 'expo-linking';
import { moderateScale } from "react-native-size-matters";
import Picture from "../modals/picture";
import ListItem from "../reusables/listItem";
import Itinerary from "../itineraries/itinerary";
import {
  activeFonts,
  colors,
  fontSizes,
  primaryButton,
  buttonText,
} from "../styles";
import { getItineraryDiveSiteByIdArray } from "../../supabaseCalls/itinerarySupabaseCalls";
import { useMapFlip } from "../itineraries/hooks";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { MapConfigContext } from "../contexts/mapConfigContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { TripDetailContext } from "../contexts/tripDetailsContext";
import { TripSitesContext } from "../contexts/tripSitesContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";

const windowWidth = Dimensions.get("window").width;

export default function BottomDrawer(props) {
  const {
    dataSet,
    dataSetType,
    lowerBound,
    upperBound,
    setVisitProfileVals,
    drawerHeader,
    emptyDrawer,
    headerButton,
  } = props;

  const { setZoomHelper } = useContext(ZoomHelperContext);
  const { setMapCenter } = useContext(MapCenterContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { formValues } = useContext(TripDetailContext);
  const { setTripDiveSites } = useContext(TripSitesContext);

  const [selectedID, setSelectedID] = useState(null);

  const photosRef = useRef(null);
  const boxheight = useSharedValue(lowerBound);
  const [bounds, setBounds] = useState({});

  useEffect(() => {
    setBounds({ lower: lowerBound, upper: upperBound });
  }, []);

  const animatedBottomDrawer = Gesture.Pan().onUpdate((event) => {
    if (event.translationY < 0) {
      boxheight.value = bounds.upper;
    } else {
      boxheight.value = bounds.lower;
    }
  });

  const animatedBoxStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(boxheight.value, {
        duration: 400,
        easing: Easing.inOut(Easing.linear),
      }),
    };
  });

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapHelper(true);
    setMapConfig(3);
    setLevelTwoScreen(false);
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

  const removeFromSitesArray = async (siteIdNo) => {
    const index = sitesArray.indexOf(siteIdNo);
    if (index > -1) {
      sitesArray.splice(index, 1);
    }
    setSitesArray(sitesArray);

    const indexLocal = formValues.siteList.indexOf(siteIdNo);
    if (indexLocal > -1) {
      formValues.siteList.splice(index, 1);
    }
    getTripDiveSites();
  };

  return (
    <Animated.View style={[styles.mainHousing, animatedBoxStyle]}>
      <GestureDetector gesture={animatedBottomDrawer}>
        <View style={styles.handle}>
          <Text style={styles.label}>{drawerHeader}</Text>
          {/* <View style={styles.tab}></View> */}
        </View>
      </GestureDetector>

      {dataSet && dataSet.length > 0 ? (
        <FlatList
          style={styles.page}
          contentContainerStyle={styles.pageContainer}
          ListFooterComponent={
            <View style={{ height: moderateScale(50) }}></View>
          }
          ListHeaderComponent={
            dataSetType === "Trips" ? (
              <View style={styles.flatListHeader}>
                <TouchableWithoutFeedback onPress={() => onNavigate()}>
                  <View style={styles.selectSitesButton}>
                    <Text style={styles.selectSitesText}>{headerButton}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            ) : null
          }
          ref={photosRef}
          pagingEnabled
          horizontal={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={moderateScale(290)}
          snapToAlignment="center"
          decelerationRate="normal"
          keyExtractor={(item) => `${item.id}-${item.dateTaken}`}
          data={dataSet}
          renderItem={({ item }) => (
            <View>
              {dataSetType === "Trips" ? (
                <ListItem
                  buttonAction={() => removeFromSitesArray(item.id)}
                  key={item.id}
                  titleText={item.name}
                ></ListItem>
              ) : null}

              {dataSetType === "DiveShopTrips" ? (
                <Itinerary
                  key={item.id}
                  itinerary={item}
                  setSelectedID={setSelectedID}
                  selectedID={selectedID}
                  buttonOneText="Map"
                  buttonOneIcon="anchor"
                  buttonOneAction={() =>
                    useMapFlip(
                      item.siteList,
                      setSitesArray,
                      setZoomHelper,
                      setLevelOneScreen,
                      setMapConfig,
                      setMapCenter
                    )
                  }
                  buttonTwoText="Book"
                  buttonTwoIcon="diving-scuba-flag"
                  buttonTwoAction={() => openURL(item.BookingPage)}
                />
              ) : null}

              {dataSetType === "DiveSitePhotos" ? (
                <View key={`${item.id}-${item.dateTaken}`}>
                  <View style={styles.locationHeader}>
                    <Text style={styles.headerText}>{item.dateTaken}</Text>
                  </View>
                  {item.photos.length > 0 &&
                    item.photos.map((photo) => {
                      return (
                        <Picture
                          key={`${photo.id}-d`}
                          pic={photo}
                          dataSetType={dataSetType}
                          diveSiteName={item.name}
                        ></Picture>
                      );
                    })}
                </View>
              ) : null}

              {dataSetType === "ProfilePhotos" ? (
                <View key={`${item.id}-${item.dateTaken}`}>
                  <View style={styles.locationHeader}>
                    <Text style={styles.headerText}>{item.name}</Text>
                    <Text style={styles.headerText}>{item.dateTaken}</Text>
                  </View>
                  {item.photos.length > 0 &&
                    item.photos.map((photo) => {
                      return (
                        <Picture
                          key={`${photo.id}-d`}
                          pic={photo}
                          dataSetType={dataSetType}
                          diveSiteName={item.name}
                          setVisitProfileVals={setVisitProfileVals}
                        ></Picture>
                      );
                    })}           
                </View>
              ) : null}
            </View>
          )}
        />
      ) : (
        <View style={{ alignItems: "center", width: windowWidth }}>
          {dataSetType === "Trips" ? (
            <View style={styles.flatListHeader}>
              <TouchableWithoutFeedback onPress={() => onNavigate()}>
                <View style={styles.selectSitesButton}>
                  <Text style={styles.selectSitesText}>{headerButton}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}
          <Text style={styles.noSightings}>{emptyDrawer}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainHousing: {
    position: "absolute",
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 20,
    elevation: 10,
    width: windowWidth,
    borderColor: "darkgrey",
    borderWidth: moderateScale(1),
    borderTopRightRadius: moderateScale(10),
    borderTopLeftRadius: moderateScale(10),
    backgroundColor: colors.themeWhite,
  },
  page: {
    width: windowWidth,
  },
  handle: {
    zIndex: 11,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "darkgrey",
    borderBottomWidth: moderateScale(1),
    height: moderateScale(30),
    width: "100%",
  },
  flatListHeader: {
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(60),
  },
  selectSitesButton: [primaryButton, { zIndex: 10 }],
  selectSitesText: [buttonText, { marginHorizontal: moderateScale(5) }],
  label: {
    color: colors.themeBlack,
    fontFamily: activeFonts.Regular,
    fontSize: moderateScale(fontSizes.SmallText),
  },
  locationHeader: {
    flexDirection: "row",
    height: moderateScale(50),
    width: windowWidth,
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: moderateScale(2),
    borderBottomColor: "darkgrey",
    borderTopWidth: moderateScale(2),
    borderTopColor: "darkgrey",
    marginTop: "5%",
    marginBottom: "2%",
    backgroundColor: "lightgray",
  },
  headerText: {
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Medium,
  },
  noSightings: {
    marginTop: windowWidth > 600 ? "15%" : "25%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: "5%",
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(fontSizes.StandardText),
    color: colors.themeBlack,
  },
});
