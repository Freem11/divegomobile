import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useButtonPressHelper } from "./buttonPressHelper";

export default function LocationSearchButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);
  const { setLargeModal } = useContext(LargeModalContext);
  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);

  const { itterator } = useContext(IterratorContext);
  const { itterator2 } = useContext(Iterrator2Context);
  const { itterator3 } = useContext(Iterrator3Context);

  const handlePress = () => {
    setTiles(true);
    setShowFilterer(false);
    setLargeModalSecond(false);
    setLargeModal(false);
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("MapSearchButton");
    useButtonPressHelper(
      "MapSearchButton",
      activeButtonID,
      smallModal,
      setSmallModal
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={
          itterator === 11 ||
          itterator === 18 ||
          itterator2 === 3 ||
          itterator2 === 5 ||
          itterator2 === 9 ||
          itterator3 === 5
            ? null
            : handlePress
        }
        onPressIn={() => setButState(true)}
        onPressOut={() => setButState(false)}
        style={{
          alignItems: "center",
          width: moderateScale(32),
          height: moderateScale(32),
        }}
      >
        <View style={styles.buttonBox}>
          <MaterialIcons
            name="explore"
            color={butState ? "gold" : "white"}
            size={moderateScale(34)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>
            Map Search
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
