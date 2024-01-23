import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";
import { MinorContext } from "../contexts/minorContext";
import { MasterContext } from "../contexts/masterContext";

import { scale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import { getDiveSitesByIDs } from "../../supabaseCalls/diveSiteSupabaseCalls";


export default function Itinerary(props) {
  const { itinerary, selectedID, setSelectedID , setShopModal} = props;
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { mapCenter, setMapCenter } = useContext(MapCenterContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);
  const { minorSwitch, setMinorSwitch } = useContext(MinorContext);
  const { masterSwitch, setMasterSwitch } = useContext(MasterContext);

  const moreInfoHeight = useSharedValue(0);

  const toVal = scale(100);

  const moreInfoHeigth = useDerivedValue(() => {
    return interpolate(moreInfoHeight.value, [0, 1], [0, toVal]);
  });

  const tabPullx = useAnimatedStyle(() => {
    return {
      height: moreInfoHeigth.value,
    };
  });

  const startMoreInfoAnimation = (id) => {
    setSelectedID(id);

    if (moreInfoHeight.value === 0) {
      moreInfoHeight.value = withTiming(1);
    } else {
      moreInfoHeight.value = withTiming(0);
    }
  };

  const releaseMoreInfoAnimations = () => {
    moreInfoHeight.value = withTiming(0);
  };

  useEffect(() => {
    if (selectedID !== itinerary.id) {
      releaseMoreInfoAnimations();
    }
  }, [selectedID]);

  const flipMap = async (siteList) => {
    setSitesArray(siteList)
    let itinerizedDiveSites = await getDiveSitesByIDs(JSON.stringify(siteList))
    
    let lats = []
    let lngs = []
    itinerizedDiveSites.forEach((site) => {
      lats.push(site.lat)
      lngs.push(site.lng)

    })
    let moveLat = lats.reduce((acc, curr) => acc + curr, 0) / lats.length
    let moveLng = lngs.reduce((acc, curr) => acc + curr, 0) / lngs.length
    setZoomHelper(true)
    setShopModal(false)
    setMasterSwitch(false)
    setMapCenter({
      lat: moveLat,
      lng: moveLng,
    });
   
    
  };

  return (
    <View style={styles.masterBox} key={itinerary.id}>
      <View style={styles.shadowbox}>
        <View style={styles.moreBox}>
          <Text style={styles.tripName}>{itinerary.tripName}</Text>
          <TouchableWithoutFeedback
            onPress={() => startMoreInfoAnimation(itinerary.id)}
          >
            <Text style={styles.opener}>More Info</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.buttonBox}>
        <TouchableWithoutFeedback
            onPress={() => flipMap(itinerary.siteList)}
          >
          <View style={styles.sitesButton}>
            <FontAwesome5 name="anchor" size={24} color="gold" />
          </View>
          </TouchableWithoutFeedback>
          <View style={styles.bookButton}>
          <MaterialCommunityIcons
            name="diving-scuba-flag"
            size={24}
            color="red"
          />
          </View>
        </View>
      </View>
      <Animated.View style={[tabPullx, styles.extraBox]}>
        <View style={styles.topRail}>
          <Text style={styles.dateText}>
            {itinerary.startDate} to {itinerary.endDate}
          </Text>
          <Text style={styles.priceText}>{itinerary.price}</Text>
        </View>

        <Text style={styles.lowerText}>{itinerary.description}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterBox: {
    width: "100%",
    marginBottom: scale(10),
  },
  shadowbox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#538dbd",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    height: 80,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
  },
  moreBox: {
    flexDirection: "column",
    width: "60%",
    height: "100%",
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%",
    height: "100%",
  },
  sitesButton: {
    marginLeft: scale(20),
    backgroundColor: "black",
    height: scale(35),
    width: scale(35),
    borderRadius: scale(30),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  bookButton: {
    marginRight: scale(20),
    backgroundColor: "white",
    height: scale(35),
    width: scale(35),
    borderRadius: scale(30),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  tripName: {
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(15),
    marginLeft: scale(10),
    marginTop: scale(5),
    height: "60%",
  },
  opener: {
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(12),
    marginLeft: scale(70),
    marginTop: scale(0),
  },
  extraBox: {
    zIndex: -1,
    marginLeft: "5%",
    width: "93%",
    marginTop: scale(-10),
    backgroundColor: "#F0EEEB",
    borderBottomEndRadius: scale(10),
    borderBottomStartRadius: scale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5,

    elevation: 10,
  },
  lowerText: {
    marginTop: scale(15),
    marginLeft: scale(30),
    fontFamily: "Itim_400Regular",
    fontSize: scale(11),
    color: "#000000",
  },
  topRail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(10),
    marginLeft: scale(20),
    marginRight: scale(20),
  },
  dateText: {
    fontFamily: "Itim_400Regular",
    fontSize: scale(12),
    color: "#000000",
  },
  priceText: {
    fontFamily: "Itim_400Regular",
    fontSize: scale(12),
    color: "#000000",
  },
});
