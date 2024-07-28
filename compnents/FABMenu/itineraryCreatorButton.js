import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { useButtonPressHelper } from "./buttonPressHelper";

export default function ItineraryListButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);
  const { setSmallModal } = useContext(SmallModalContext);

  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);

  const handlePress = () => {
    setTiles(true);
    setShowFilterer(false);
    setLargeModalSecond(false);
    setSmallModal(false);
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("ItineraryListButton");
    useButtonPressHelper(
      "ItineraryListButton",
      activeButtonID,
      largeModal,
      setLargeModal
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handlePress}
        onPressIn={() => setButState(true)}
        onPressOut={() => setButState(false)}
        style={{
          alignItems: "center",
          width: moderateScale(32),
          height: moderateScale(32),
        }}
      >
        <View style={styles.buttonBox}>
          <MaterialCommunityIcons
            name="diving-scuba-flag"
            size={moderateScale(34)}
            color={butState ? "gold" : "white"}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>
            Trip Creator
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    fontSize: "2rem",
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#538bdb",
    width: moderateScale(80),
    height: moderateScale(55),
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(13),
    marginTop: moderateScale(0),
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(13),
    marginTop: moderateScale(0),
  },
});
