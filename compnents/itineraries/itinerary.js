import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import {
  activeFonts,
  colors,
  fontSizes
} from "../styles";

export default function Itinerary(props) {
  const {
    itinerary,
    selectedID,
    setSelectedID,
    buttonOneText,
    buttonOneIcon,
    buttonOneAction,
    buttonTwoText,
    buttonTwoIcon,
    buttonTwoAction,
  } = props;

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
          <View style={{ width: "10%" }}></View>
          <TouchableWithoutFeedback onPress={buttonOneAction}>
            <MaterialCommunityIcons
              name={buttonOneIcon}
              size={moderateScale(22)}
              color={"darkgrey"}
              onPress={buttonOneAction}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={buttonTwoAction}>
            <MaterialCommunityIcons
              name={buttonTwoIcon}
              size={moderateScale(22)}
              color={"darkgrey"}
              onPress={buttonTwoAction}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Animated.View style={[tabPullx, styles.extraBox]}>
        <View style={styles.topRail}>
          <Text style={styles.dateText}>
            {itinerary.startDate} to {itinerary.endDate}
          </Text>
          <Text style={styles.priceText}>{itinerary.price}</Text>
        </View>

        <ScrollView style={{ width: "95%" }}>
          <Text style={styles.lowerText}>{itinerary.description}</Text>
        </ScrollView>
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
    flexDirection: "row",
    height: moderateScale(75),
    width: "98%",
    marginLeft: "1%",
    marginBottom: "2%",
    backgroundColor: colors.themeWhite,
    borderWidth: moderateScale(1),
    borderColor: "darkgrey",
    borderRadius: moderateScale(10),
    textAlign: "center",
    justifyContent: "center",
    listStyle: "none",
  },
  moreBox: {
    flexDirection: "column",
    width: "58%",
    height: "100%",
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "40%",
    height: "100%",
    paddingHorizontal: "2%",
    // backgroundColor: "pink"
  },
  tripName: {
    fontFamily: activeFonts.Light,
    color: colors.themeBlack,
    fontSize: moderateScale(fontSizes.StandardText),
    marginLeft: scale(10),
    marginTop: scale(5),
    height: "60%",
  },
  opener: {
    fontFamily: activeFonts.Medium,
    color: colors.themeBlack,
    fontSize: moderateScale(fontSizes.SmallText),
    marginLeft: scale(70),
    marginTop: scale(0),
  },
  extraBox: {
    zIndex: -1,
    marginLeft: "5%",
    width: "93%",
    marginTop: scale(-10),
    backgroundColor: colors.themeWhite,
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
    fontFamily: activeFonts.lig,
    fontSize: moderateScale(fontSizes.SmallText),
    color: colors.themeBlack,
  },
  topRail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scale(10),
    marginLeft: scale(20),
    marginRight: scale(20),
  },
  dateText: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(fontSizes.SmallText),
    color: colors.themeBlack,
  },
  priceText: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(fontSizes.SmallText),
    color: colors.themeBlack,
  },
});
