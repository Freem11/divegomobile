import React, { useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ZoomHelperContext } from "../contexts/zoomHelperContext";
import { MasterContext } from "../contexts/masterContext";
import { MapConfigContext } from '../contexts/mapConfigContext';
import { LargeModalContext } from "../contexts/largeModalContext";
import MaterialCommunityIconsButton from "../reusables/materialCommunityIconsButton";
import { useMapFlip } from './hooks';
import { scale, moderateScale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";

export default function Itinerary(props) {
  const {
    itinerary,
    selectedID,
    setSelectedID,
    buttonOneText,
    buttonOneIcon,
    buttonTwoText,
    buttonTwoIcon,
  } = props;
  const { mapConfig, setMapConfig } =useContext(MapConfigContext);
  const { setSitesArray } = useContext(SitesArrayContext);
  const { setMapCenter } = useContext(MapCenterContext);
  const { setZoomHelper } = useContext(ZoomHelperContext);
  const { setMasterSwitch } = useContext(MasterContext);
  const { setLargeModal } = useContext(LargeModalContext);

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
          <MaterialCommunityIconsButton
            icon={buttonOneIcon}
            buttonAction={() => useMapFlip(itinerary.siteList, setSitesArray, setZoomHelper, setLargeModal, setMapConfig, setMapCenter)}
            iconColour="gold"
            buttonText={buttonOneText}
          />
          <MaterialCommunityIconsButton
            icon={buttonTwoIcon}
            iconColour="red"
            buttonText={buttonTwoText}
          />
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
    height: scale(80),
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
    width: "58%",
    height: "100%",
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "40%",
    height: "100%",
    // backgroundColor: "pink",
    paddingLeft: moderateScale(-20)
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
