import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useActiveScreenStore } from "../../store/useActiveScreenStore";
import { LevelTwoScreenContext } from '../contexts/levelTwoScreenContext';
import { activeFonts, colors, fontSizes } from "../styles";
import { UserProfileContext } from "../contexts/userProfileContext";
import ButtonIcon from "../reusables/buttonIcon";

export default function ProfileButton() {
  const [butState, setButState] = useState(false);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { levelTwoScreen, setLevelTwoScreen } = useContext(LevelTwoScreenContext);
 
  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);
 
  const { profile } = useContext(UserProfileContext);



  const handleScreen = () => {
    setActiveScreen("ProfileScreen", {id: profile?.id})
    setLevelTwoScreen(true)
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handleScreen}
        onPressIn={() => setButState(true)}
        onPressOut={() => setButState(false)}
        style={{
          alignItems: "center",
          width: moderateScale(32),
          height: moderateScale(32),
        }}
      >
        <View style={styles.buttonBox}>
              <ButtonIcon 
                icon="person"
                onPress={handleScreen}
                size='icon'
                fillColor={colors.themeWhite}
                title="Profile"
              />
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
    paddingTop: moderateScale(5)
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
