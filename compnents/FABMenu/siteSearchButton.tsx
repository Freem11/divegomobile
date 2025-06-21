import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { LevelOneScreenContext } from '../contexts/levelOneScreenContext';
import { activeFonts, colors, fontSizes } from "../styles";
import { useActiveScreenStore } from "../../store/useActiveScreenStore";
import ButtonIcon from "../reusables/buttonIcon";
import { useFeedScreenStore } from "../feed/store/useScreenStore";
import { FEED_SCREEN } from "../feed/store/types";

export default function SiteSearchButton() {
  const [butState, setButState] = useState(false);
  const openScreen = useFeedScreenStore((state) => state.openScreen);
  // const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  // const { levelOneScreen, setLevelOneScreen } = useContext(LevelOneScreenContext);

  const handlePress = () => {
    openScreen(FEED_SCREEN.FEED_MESSAGES)
    // setLevelOneScreen(true);
    // setActiveScreen("SearchScreen");
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
              <ButtonIcon 
                icon="dive-watch"
                onPress={handlePress}
                size='icon'
                fillColor={colors.themeWhite}
                title="Notifications"
              />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
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
    marginTop: moderateScale(5)
  },
  buttonlabel: {
    fontFamily: activeFonts.Medium,
    color: colors.themeWhite,
    fontSize: fontSizes.SmallText,
    marginTop: moderateScale(2),
  },
  buttonlabelAlt: {
    fontFamily: activeFonts.Medium,
    color: colors.secondaryYellow,
    fontSize: fontSizes.SmallText,
    marginTop: moderateScale(2),
  },
});
