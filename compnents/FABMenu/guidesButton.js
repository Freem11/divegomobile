import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale, moderateScale } from 'react-native-size-matters';
import { TutorialLaunchPadContext } from "../contexts/tutorialLaunchPadContext";
import { TutorialContext } from "../contexts/tutorialContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import TutorialLaunchPadModal from "../modals/tutorialsModal";

export default function GuidesButton() {
  const [butState, setButState] = useState(false);
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  
  return (
    <View style={styles.container}>
     <TouchableWithoutFeedback
          onPress={() => {tutorialRunning ? null : setTutorialLaunchpadModal(!tutorialLaunchpadModal)}}
          onPressIn={() => setButState(true)}
          onPressOut={() => setButState(false)}
          style={{
            alignItems: "center",
            width: moderateScale(32),
            height: moderateScale(32),
          }}
        >
        <View style={styles.buttonBox}>
          <FontAwesome5
            name="question"
            color={butState ? "gold" : "white"}
            size={moderateScale(28)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>User Guides</Text>
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
    fontSize: "2rem"
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "darkgrey",
    // borderRadius: 10,
    backgroundColor: "#538bdb",
    width: moderateScale(80),
    height: moderateScale(55),
    marginTop: moderateScale(1)
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(11),
    marginTop: moderateScale(2),
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(11),
    marginTop: moderateScale(2)
  },
});
