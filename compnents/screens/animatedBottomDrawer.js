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
  useDerivedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import Picture from "../modals/picture";
import ListItem from "../reusables/listItem";
import {
  activeFonts,
  colors,
  fontSizes,
  primaryButton,
  buttonText,
} from "../styles";
import {
  getItineraryDiveSiteByIdArray,
} from "../../supabaseCalls/itinerarySupabaseCalls";

import { MapHelperContext } from "../contexts/mapHelperContext";
import { MapConfigContext } from "../contexts/mapConfigContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { TripDetailContext } from "../contexts/tripDetailsContext";
import { TripSitesContext } from "../contexts/tripSitesContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function BottomDrawer(props) {
  const {
    dataSet,
    dataSetType,
    lowerBound,
    upperBound,
    drawerHeader,
    emptyDrawer,
    headerButton,
  } = props;

  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);
  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  
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
    console.log("???", siteIdNo)
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

      {dataSet ? (
        <FlatList
          style={styles.page}
          contentContainerStyle={styles.pageContainer}
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
                <ListItem buttonAction={() => removeFromSitesArray(item.id)} key={item.id} titleText={item.name}></ListItem>
              ) : null}

              {dataSetType === "DiveSitePhotos" ? (
                   <View key={`${item.id}-${item.dateTaken}`}>
                   <View style={styles.locationHeader}>
                     <Text>{item.dateTaken}</Text>
                   </View>
                   {item.photos.length > 0 &&
                     item.photos.map((photo) => {
                       return (
                         <Picture key={`${photo.id}-d`} pic={photo} dataSetType={dataSetType} diveSiteName={item.name}></Picture>
                       );
                     })}
                 </View>
              ) : null}

              {dataSetType === "ProfilePhotos" ? (
                <View key={`${item.id}-${item.dateTaken}`}>
                  <View style={styles.locationHeader}>
                    <Text>{item.name}</Text>
                    <Text>{item.dateTaken}</Text>
                  </View>
                  {item.photos.length > 0 &&
                    item.photos.map((photo) => {
                      return (
                        <Picture key={`${photo.id}-d`} pic={photo} dataSetType={dataSetType} diveSiteName={item.name}></Picture>
                      );
                    })}
                </View>
              ) : null}
            </View>
          )}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
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
    width: windowWidth
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
  tab: {
    backgroundColor: colors.themeBlack,
    height: moderateScale(5),
    width: moderateScale(50),
    borderRadius: moderateScale(10),
  },
  label: {
    color: colors.themeBlack,
    fontFamily: activeFonts.Regular,
    fontSize: moderateScale(fontSizes.SmallText),
  },
  shadowbox: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
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
  noSightings: {
    marginTop: windowWidth > 600 ? "15%" : "25%",
    height: moderateScale(25),
    width: "60%",
    // marginLeft: "20%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(fontSizes.StandardText),
    color: colors.themeBlack,
  },
});
