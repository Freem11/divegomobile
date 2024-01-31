import React from "react";
import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, TextInput, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchTextContext } from "../contexts/searchTextContext";
import { AreaPicsContext } from "../contexts/areaPicsContext";
import { DiveSiteSearchModalContext } from "../contexts/diveSiteSearchContext";
import { MapSearchModalContext } from "../contexts/mapSearchContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import { TutorialLaunchPadContext } from "../contexts/tutorialLaunchPadContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { SettingsContext } from "../contexts/gearModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PhotoFilterer() {
  const { textvalue, setTextValue } = useContext(SearchTextContext);
  const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const { gearModal, setGearModal } = useContext(SettingsContext);
  const { profileModal, setProfileModal } = useContext(ProfileModalContext);
  const { mapSearchModal, setMapSearchModal } = useContext(
    MapSearchModalContext
  );
  const { diveSiteSearchModal, setDiveSiteSearchModal } = useContext(
    DiveSiteSearchModalContext
  );
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);
  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );

  const handleChange = async (text) => {
    setTextValue(text);
    setGearModal(false);
    setProfileModal(false);
    setMapSearchModal(false);
    setDiveSiteSearchModal(false);
    setPicAdderModal(false);
    setDiveSiteAdderModal(false);
    setTutorialLaunchpadModal(false);
  };

  const handleClear = () => {
    setTextValue("");
    setGearModal(false);
    setProfileModal(false);
    setMapSearchModal(false);
    setDiveSiteSearchModal(false);
    setPicAdderModal(false);
    setDiveSiteAdderModal(false);
    setTutorialLaunchpadModal(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.suggestInput}
        placeholder={"Dive Deeper!"}
        value={textvalue}
        placeholderTextColor="darkgrey"
        color="black"
        onChangeText={handleChange}
      ></TextInput>
      <TouchableOpacity
        onPress={handleClear}
        style={{
          width: scale(20),
          height: scale(20),
          zIndex: 10,
          elevation: 10,
          // backgroundColor: "pink"
        }}
      >
        <View
          style={[styles.xButton, { opacity: textvalue.length > 0 ? 1 : 0 }]}
          onPress={handleClear}
        >
          <MaterialIcons
            name="highlight-remove"
            size={scale(14)}
            color="lightgrey"
            onPress={handleClear}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 1,
    width: windowWidth > 600 ? scale(130) : scale(150),
    borderBottomRightRadius: scale(10),
    borderBottomLeftRadius: scale(10),
    paddingRight: 5,
    paddingLeft: 12,
    fontSize: "2rem",
  },
  suggestInput: {
    fontSize: windowWidth > 600 ? scale(10) : scale(12),
    marginLeft: scale(5),
    width: "85%",
    textAlign: "center",
    // backgroundColor: "green"
  },
  xButton: {
    // position: "absolute",
    marginTop: scale(3),
    marginLeft: 2,
    zIndex: 10,
    elevation: 10,
  },
});
