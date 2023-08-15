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
import { IterratorContext } from "../contexts/iterratorContext";
import InsetShadow from "react-native-inset-shadow";
import { scale } from "react-native-size-matters";
import TutorialBase from "../tutorial/tutorialBase";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TutorialsModal() {

  const [tutorialCloseState, setTutorialCloseState] = useState(false);

  const [tutorialsCloseState, setTutorialsCloseState] = useState(false);
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );

  //Tutorial Model Animation
  const tutorialModalY = useSharedValue(windowHeight);
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { itterator, setItterator } = useContext(IterratorContext);

  const tutorialModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: tutorialModalY.value }],
    };
  });

  const startGuideModalAnimations = () => {
    if (guideModal) {
      tutorialModalY.value = withTiming(0);
    } else {
      tutorialModalY.value = withTiming(windowHeight);
    }
  };

  useEffect(() => {
    startGuideModalAnimations();
    if (!itterator && guideModal) {
      setItterator(0);
    }
  }, [guideModal]);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>DiveGo Guides</Text>
        <TouchableWithoutFeedback
          onPress={() => setGuideModal(!guideModal)}
          onPressIn={() => setTutorialsCloseState(true)}
          onPressOut={() => setTutorialsCloseState(false)}
        >
          <View
            style={
              tutorialsCloseState
                ? styles.closeButtonPressed
                : styles.closeButton
            }
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.inputContainer}>

      <TouchableWithoutFeedback
        onPress={() => setGuideModal(!guideModal)}
        onPressIn={() => setTutorialCloseState(true)}
        onPressOut={() => setTutorialCloseState(false)}
      >
        <View style={tutorialCloseState ? styles.openTutorialButtonPressed : styles.openTutorialButton}>
          <Text
            style={{
              marginLeft: 5,
              fontFamily: "BubblegumSans_400Regular",
              color: "gold",
            }}
          >
            Intro Guide
          </Text>
        </View>
      </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.tutorialModal, tutorialModalReveal]}
        >
          <TutorialsModal tutorialModalY={tutorialModalY} />
        </Animated.View>
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
    fontFamily: "IndieFlower_400Regular",
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
    fontFamily: "IndieFlower_400Regular",
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
  tutorialModal: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 50,
    left: 0,
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
    fontFamily: "PermanentMarker_400Regular",
    fontSize: scale(17),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginLeft: "0%",
    marginRight: "18%",
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
  openTutorialButtonPressed: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    marginLeft: "30%",
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
    marginLeft: "30%",
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
