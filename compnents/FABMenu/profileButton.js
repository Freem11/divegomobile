import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { LevelTwoScreenContext } from '../contexts/levelTwoScreenContext';
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { useButtonPressHelper } from "./buttonPressHelper";
import { activeFonts, colors, fontSizes } from "../styles";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedProfileContext } from '../contexts/selectedProfileModalContext'

export default function ProfileButton() {
  const [butState, setButState] = useState(false);
  const { activeScreen, setActiveScreen } = useContext(
    ActiveScreenContext
    );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);

  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);
 
  const { profile } = useContext(UserProfileContext);
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );

  const handlePress = () => {
    setSelectedProfile(profile)
    setTiles(true);
    setShowFilterer(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("ProfileScreen");
    useButtonPressHelper(
      "ProfileScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => handlePress()}
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
            name="account"
            color={butState ? "gold" : "white"}
            size={moderateScale(37)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>
            Profile
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
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
    backgroundColor: colors.primaryBlue,
    width: moderateScale(80),
    height: moderateScale(55),
  },
  buttonlabel: {
    fontFamily: activeFonts.Medium,
    color: colors.themeWhite,
    fontSize: fontSizes.SmallText,
    marginTop: moderateScale(0),
  },
  buttonlabelAlt: {
    fontFamily: activeFonts.Medium,
    color: colors.secondaryYellow,
    fontSize: fontSizes.SmallText,
    marginTop: moderateScale(0),
  },
});
