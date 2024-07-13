import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { TutorialLaunchPadContext } from "../contexts/tutorialLaunchPadContext";
import { TutorialModelContext } from "../contexts/tutorialModalContext";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";

import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";

import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";

import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";

import { scale, moderateScale } from "react-native-size-matters";
import { TutorialContext } from "../contexts/tutorialContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModalHeader from "../reusables/modalHeader";
import PrimaryButton from "../reusables/primaryButton";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TutorialLaunchPadModal() {
  const { fullScreenModal, setFullScreenModal } = useContext(FullScreenModalContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { activeTutorialID, setActiveTutorialID } = useContext(
    ActiveTutorialIDContext
  );

  const { itterator, setItterator } = useContext(IterratorContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);

  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const [tutPadCloseState, setTutPadCloseState] = useState(false);
  const [tutPad2CloseState, setTutPad2CloseState] = useState(false);
  const [tutPad3CloseState, setTutPad3CloseState] = useState(false);

  const [tutorialsCloseState, setTutorialsCloseState] = useState(false);

  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );

  const handleTutorialStartup = () => {
    setTutorialRunning(true);
    setItterator(0);
    setPreviousButtonID(activeButtonID);
    setActiveTutorialID("FirstGuide");
    setLargeModal(!largeModal);
    setFullScreenModal(!fullScreenModal);
  };

  const handleSecondTutorialStartup = () => {
    setTutorialRunning(true);
    setItterator2(0);
    setPreviousButtonID(activeButtonID);
    setActiveTutorialID("SecondGuide");
    setLargeModal(!largeModal);
    setFullScreenModal(!fullScreenModal);
  };

  const handleThirdTutorialStartup = () => {
    setTutorialRunning(true);
    setItterator3(0);
    setPreviousButtonID(activeButtonID);
    setActiveTutorialID("ThirdGuide");
    setLargeModal(!largeModal);
    setFullScreenModal(!fullScreenModal);
  };

  const handleClose = () => {
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("TutorialsButton");
    setLargeModal(!largeModal);
  };

  return (
    <View style={styles.container}>
      <ModalHeader
        titleText={"Scuba SEAsons Guides"}
        onClose={handleClose}
        icon={null}
        altButton={null}
      />
      <View style={styles.inputContainer}>
        <PrimaryButton
          buttonAction={handleTutorialStartup}
          label={"Intro Guide"}
          icon={null}
          textColor={null}
          bgColor={null}
          bgPressedColor={null}
        />
        <PrimaryButton
          buttonAction={handleSecondTutorialStartup}
          label={"Fun With Dive Sites"}
          icon={null}
          textColor={null}
          bgColor={null}
          bgPressedColor={null}
        />

        <PrimaryButton
          buttonAction={handleThirdTutorialStartup}
          label={"Photogenics"}
          icon={null}
          textColor={null}
          bgColor={null}
          bgPressedColor={null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    // backgroundColor: 'green',
    marginTop: "5%",
    marginBottom: "2%",
    width: "98%",
    marginLeft: 2,
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  inputContainer: {
    height: "35%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: moderateScale(120),
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  openTutorialButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: scale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  openTutorialButtonPressed: {
    backgroundColor: "#538dbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: scale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
});
