import React from "react";
import { useContext } from "react";
import { StyleSheet, View, TextInput, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import {
  TouchableOpacity,
} from "react-native-gesture-handler";
import { activeFonts, colors, fontSizes } from "../styles";
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
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PhotoFilterer() {
  const { setSmallModal } = useContext(SmallModalContext);
  const { setLargeModal } = useContext(LargeModalContext);
  const { setLargeModalSecond } = useContext(LargeModalSecondContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);

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
    setSmallModal(false);
    setLargeModal(false);
    setLargeModalSecond(false);
    setFullScreenModal(false);
  };

  const handleClear = () => {
    setTextValue("");
    setSmallModal(false);
    setLargeModal(false);
    setLargeModalSecond(false);
    setFullScreenModal(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.suggestInput}
        placeholder={"Dive Deeper!"}
        value={textvalue}
        placeholderTextColor="darkgrey"
        color={colors.themeBlack}
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
    backgroundColor: colors.themeWhite,
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
    fontSize: fontSizes.StandardText,
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
