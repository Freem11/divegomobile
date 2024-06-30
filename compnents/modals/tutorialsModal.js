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
import InsetShadow from "react-native-inset-shadow";
import { scale, moderateScale } from "react-native-size-matters";
import { TutorialContext } from "../contexts/tutorialContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModalHeader from "../reusables/modalHeader";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TutorialLaunchPadModal() {
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
    setTutorialLaunchpadModal(!tutorialLaunchpadModal);
    setGuideModal(!guideModal);
  };

  const handleSecondTutorialStartup = () => {
    setTutorialRunning(true);
    setTutorialLaunchpadModal(!tutorialLaunchpadModal);
    setSecondGuideModal(!secondGuideModal);
  };

  const handleThirdTutorialStartup = () => {
    setTutorialRunning(true);
    setTutorialLaunchpadModal(!tutorialLaunchpadModal);
    setThirdGuideModal(!thirdGuideModal);
  };

  const handleClose = () => {
    setTutorialLaunchpadModal(!tutorialLaunchpadModal)
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
        <View
          style={
            tutPadCloseState
              ? styles.openTutorialButtonPressed
              : styles.openTutorialButton
          }
        >
          <TouchableOpacity
            onPress={handleTutorialStartup}
            onPressIn={() => setTutPadCloseState(true)}
            onPressOut={() => setTutPadCloseState(false)}
            disabled={tutorialRunning}
            style={{
              width: moderateScale(200),
              height: moderateScale(22),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 3,
                marginTop: -4,
                fontFamily: "PatrickHand_400Regular",
                color: "gold",
                fontSize: moderateScale(19)
              }}
            >
              Intro Guide
            </Text>
          </TouchableOpacity>
        </View>
     
          <View
            style={
              tutPad2CloseState
                ? styles.openTutorialButtonPressed
                : styles.openTutorialButton
            }
          >
            <TouchableOpacity
            onPress={handleSecondTutorialStartup}
            onPressIn={() => setTutPad2CloseState(true)}
            onPressOut={() => setTutPad2CloseState(false)}
            disabled={tutorialRunning}
            style={{
              width: moderateScale(200),
              height: moderateScale(22),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 3,
                marginTop: -4,
                fontFamily: "PatrickHand_400Regular",
                color: "gold",
                fontSize: moderateScale(19)
              }}
            >
              Fun With Dive Sites
            </Text>
            </TouchableOpacity>
          </View>
      
          <View
            style={
              tutPad3CloseState
                ? styles.openTutorialButtonPressed
                : styles.openTutorialButton
            }
          >
             <TouchableOpacity
            onPress={handleThirdTutorialStartup}
            onPressIn={() => setTutPad3CloseState(true)}
            onPressOut={() => setTutPad3CloseState(false)}
            disabled={tutorialRunning}
            style={{
              width: moderateScale(200),
              height: moderateScale(22),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 3,
                marginTop: -5,
                fontFamily: "PatrickHand_400Regular",
                color: "gold",
                fontSize: moderateScale(19),
                height: "200%"
              }}
            >
              Photogenics
            </Text>
            </TouchableOpacity>
          </View>
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
    width: "96%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(90)
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
