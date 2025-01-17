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
  useDerivedValue,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { openURL } from 'expo-linking';
import { moderateScale } from "react-native-size-matters";
import Picture from '../compnents/modals/picture';
import ListItem from '../compnents/reusables/listItem';
import Itinerary from '../compnents/itineraries/itinerary';
import {
  activeFonts,
  colors,
  fontSizes,
  primaryButton,
  buttonText,
  primaryButtonAlt,
} from '../compnents/styles';
import { getItineraryDiveSiteByIdArray } from "../supabaseCalls/itinerarySupabaseCalls";
import { useMapFlip } from '../compnents/itineraries/hooks';
import { MapHelperContext } from "./contexts/mapHelperContext";
import { MapConfigContext } from "./contexts/mapConfigContext";
import { LevelOneScreenContext } from "./contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "./contexts/levelTwoScreenContext";
import { SitesArrayContext } from "./contexts/sitesArrayContext";
import { TripDetailContext } from "./contexts/tripDetailsContext";
import { TripSitesContext } from "./contexts/tripSitesContext";
import { MapCenterContext } from "./contexts/mapCenterContext";
import { ZoomHelperContext } from "./contexts/zoomHelperContext";
import DrawerContent from './drawerContent';

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
    setIsDrawerOpen,
    isDrawerOpen
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


  const startDrawerAnimation = () => {
    if (boxheight.value = upperBound) {
      boxheight.value = lowerBound;
    } else {
      boxheight.value = upperBound
    }
  };

  useEffect(() => {
    startDrawerAnimation();
  }, [isDrawerOpen]);

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
        easing: Easing.inOut(Easing.linear)}, (finished) => {
          if (finished) {
            runOnJS(() => setIsDrawerOpen(true)); // Trigger setState on animation completion
          }
      }),
    };
  });

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapHelper(true);
    setMapConfig(3);
    setLevelTwoScreen(false);
  };

   
 

  return (
    <Animated.View style={[styles.mainHousing, animatedBoxStyle]}>
         <GestureDetector gesture={animatedBottomDrawer}>
        <TouchableWithoutFeedback onPress={() =>  boxheight.value = upperBound}>
            <View style={styles.handle}>
               <Text style={styles.label}>{drawerHeader}</Text>
            </View>
        </TouchableWithoutFeedback>
         </GestureDetector>

<DrawerContent
lowerBound={lowerBound}
boxheight={boxheight}
/>


     

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
    zIndex: 2,
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
    backgroundColor: colors.primaryBlue,
    borderTopRightRadius: moderateScale(10),
    borderTopLeftRadius: moderateScale(10),
    borderBottomWidth: moderateScale(1),
    height: moderateScale(30),
    width: windowWidth,
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
    color: colors.themeWhite,
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
    flexWrap: 'wrap',
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginHorizontal: "5%",
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(fontSizes.StandardText),
    color: colors.themeBlack,
  },
  mapButtonWrapper: [
    primaryButton,
    {
      position: 'absolute',
      top: 800,
      left: -130,
      alignItems: "center",
      textAlign: "center",
      zIndex: 20,
    },
  ],
  mapButtonText: buttonText,
});
