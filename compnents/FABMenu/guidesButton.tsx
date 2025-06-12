import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { useButtonPressHelper } from "./buttonPressHelper";
import { activeFonts, colors, fontSizes } from "../styles";
import ButtonIcon from "../reusables/buttonIcon";

export default function GuidesButton() {
  const [butState, setButState] = useState(false);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);

  const { setTiles } = useContext(CarrouselTilesContext);
  const { setShowFilterer } = useContext(PullTabContext);
 
  const handlePress = () => {
    setTiles(true);
    setShowFilterer(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("TutorialsButton");
    useButtonPressHelper(
      "TutorialsButton",
      activeScreen,
      // largeModal,
      // setLargeModal
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={null}
        // onPressIn={() => setButState(true)}
        // onPressOut={() => setButState(false)}
        style={{
          alignItems: "center",
          width: moderateScale(32),
          height: moderateScale(32),
        }}
      >
        <View style={styles.buttonBox}>
              <ButtonIcon 
                icon="question-mark"
                onPress={() => null}
                size='icon'
                fillColor={colors.neutralGrey}
                title="Guides"
              />
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
    backgroundColor: colors.primaryBlue,
    width: moderateScale(80),
    height: moderateScale(55),
    marginTop: moderateScale(4)
  },
  buttonlabel: {
    fontFamily: activeFonts.Medium,
    color: "darkgrey",
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
