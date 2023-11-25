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
import { scale } from "react-native-size-matters";
import { TutorialContext } from "../contexts/tutorialContext";
import { TouchableOpacity } from "react-native-gesture-handler";

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

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>Scuba SEAsons Guides</Text>
        <View
          style={
            tutorialsCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={() => setTutorialLaunchpadModal(!tutorialLaunchpadModal)}
            onPressIn={() => setTutorialsCloseState(true)}
            onPressOut={() => setTutorialsCloseState(false)}
            style={{
              width: scale(30),
              height: scale(30),
              alignItems: "center",
            }}
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableOpacity>
        </View>
      </View>

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
              width: 200,
              height: 22,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 3,
                marginTop: -4,
                fontFamily: "PatrickHand_400Regular",
                color: "gold",
                fontSize: 19
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
              width: 200,
              height: 22,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 3,
                marginTop: -4,
                fontFamily: "PatrickHand_400Regular",
                color: "gold",
                fontSize: 19
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
              width: 200,
              height: 22,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginLeft: 3,
                marginTop: -5,
                fontFamily: "PatrickHand_400Regular",
                color: "gold",
                fontSize: 19,
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
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: Platform.OS === "ios" ? "-20%" : "-20%",
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
  header: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 25,
    marginTop: -150,
  },
  text: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 5,
  },
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "2%",
    marginLeft: "12%",
    width: "80%",
    height: scale(30),
  },
  header2: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(26),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginTop: "-1%",
    marginLeft: "7%",
    marginRight: "15%",
    // backgroundColor: "green"
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  openTutorialButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
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
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
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
