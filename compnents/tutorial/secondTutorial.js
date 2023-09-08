import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import mantaIOS from "../png/Manta32.png";
import seaLionGuy from "../png/seaLion.png";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { UserProfileContext } from "../contexts/userProfileContext";
import { scale } from "react-native-size-matters";
import { MapRegionContext } from "../contexts/mapRegionContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { TutorialResetContext } from "../contexts/tutorialResetContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { ChapterContext } from "../contexts/chapterContext";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SecondTutorial() {
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { setAddSiteVals } = useContext(DiveSpotContext);

  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
  const { tutorialReset, setTutorialReset } = useContext(TutorialResetContext);
  const { setMapCenter } = useContext(MapCenterContext);
  const { setRegion } = useContext(MapRegionContext);

  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (tutorialReset) {
      setItterator2(null);
      setDiveSiteAdderModal(false);
      setTutorialRunning(false);
      setSecondGuideModal(false);
      setTutorialReset(false);
      resetTutorial();
    }
  }, [tutorialReset]);

  useEffect(() => {
    console.log(chapter);
    setDiveSiteAdderModal(false);
    resetTutorial();

    switch (chapter) {
      case "Checking for a dive site":
        setItterator2(1);
        setSecondGuideModal(true);
        characterX.value = withTiming(190);
        textBoxY.value = withTiming(windowHeight * 0.85);
        break;

      case "Adding your dive sites":
        setItterator2(8);
        setSecondGuideModal(true);
        characterX.value = withTiming(190);
        textBoxY.value = withTiming(windowHeight * 0.85);
        break;
    }
  }, [chapter]);

  const resetTutorial = async () => {
    characterX.value = 1000;
    textBoxY.value = 1000;
    DsSearchY.value = scale(-1000);
    diveSiteY.value = scale(-1000);
    nextTutX.value = -300;
    setAddSiteVals({
      Site: "",
      Latitude: "",
      Longitude: "",
    });
  };

  const getProfile = async () => {
    let sessionUserId = activeSession.user.id;
    try {
      const success = await grabProfileById(sessionUserId);
      if (success) {
        setProfile(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const handleThirdTutorialStartup = () => {
    setItterator2(null);
    setDiveSiteAdderModal(false);
    setTutorialRunning(true);
    setSecondGuideModal(false);
    setThirdGuideModal(true);
  };

  const characterX = useSharedValue(1000);
  const textBoxY = useSharedValue(1000);
  const DsSearchY = useSharedValue(scale(-1000));
  const diveSiteY = useSharedValue(scale(-1000));
  const nextTutX = useSharedValue(-300);

  const text0 =
    "Hey welcome back! Now that you have a Diver Name, I can show you how you can contribute to DiveGo!";
  const text1 =
    "First, let's look at working with Dive sites, let's move to a spot with known dive sites";
  const text2 =
    "Now that the map is positioned, let's check for a dive site by tapping on the dive site search tool option, it looks like this";
  const text3 = "";
  const text4 =
    "Now that the options are open, it will show you a list of dive sites in the area, try searching for 'Copper Cliffs' and select it, once you have found it";
  const text5 = "";
  const text6 =
    "Nice! As you can see when you selected the dive site, the map zoomed to it and put that yellow indicator over it to highlight it, this means the site is in the app and ready for you to add your sightings to it later!";
  const text7 =
    "Next, let's say the site you were looking for was NOT in the app, no problem adding them is very easy!";
  const text8 =
    "To add a dive site we need to click on the dive site adding button, it's under this option, pop it open and I'll walk you through how it works";
  const text9 = "";
  const text10 =
    "This is the dive site adding form, here, you can see 3 fields and a button. First is the site name, add the dive site name in this spot";
  const text11 =
    "Next are the GPS lat and lng fields. The easiest way to get them is to be AT the dive site and simply tap the 'I'm at the dive site button'. It will take your current location and use them as the coordinates for the dive site!";
  const text12 =
    "If you are at home, and have the name of the site as well as the decimal format GPS coordinates, you can add them manually as well";
  const text13 =
    "Once you have your site name and GPS fields filled out, simply tap the 'Submit Dive Site' button at the bottom and your site will be submitted for review";
  const text14 =
    "Please note your new site won't automatically be added to the map, the DiveGo team will verify your submission before committing to the map, but after that your site will go in and be credited to you with your diver name that we setup earlier!";
  const text15 =
    "Give it a try for yourself: add a name and GPS using the 'I'm at the dive site' button and submit!";
  const text16 = "";
  const text17 =
    "Nice Job, That's how you add a new dive site to DiveGo! In this case, since this is a guide, the entry was not submitted, but you can add from now on, in the same way.";
  const text18 =
    "That's it for adding dive sites to the app! In the next guide we will look at adding sea creature sighting photos! Tap on this button to go to that guide next, otherwise tap anywhere else to close, and thanks for joining me again!";
  const text19 = "";

  const [textRead, setTextRead] = useState("");
  const [textPrinting, setTextPrinting] = useState(true);

  const feederArray = [
    text0,
    text1,
    text2,
    text3,
    text4,
    text5,
    text6,
    text7,
    text8,
    text9,
    text10,
    text11,
    text12,
    text13,
    text14,
    text15,
    text16,
    text17,
    text18,
    text19,
  ];

  //  var interval;

  const setupText = (pushVal) => {
    if (
      itterator2 === 3 ||
      itterator2 === 5 ||
      itterator2 === 9 ||
      itterator2 === 16 ||
      itterator2 >= 19
    ) {
      return;
    } else {
      if (pushVal === 1 && itterator2 < feederArray.length - 1) {
        if (textPrinting) {
          setTextPrinting(false);
          textArray = "";
          setTextRead("");
          setTextRead(feederArray[itterator2]);
        } else {
          setItterator2((prev) => prev + pushVal);
          setTextPrinting(true);
        }
      }

      if (pushVal === 1 && itterator2 === feederArray.length - 1) {
        setSecondGuideModal(false);
      }
    }
  };

  let textArray;

  function printOutText() {
    if (textArray.length > 0) {
      setTextRead((prev) => prev + textArray[0]);
      textArray = textArray.slice(1);
    } else {
      setTextPrinting(false);
    }
  }

  function cleanUp() {
    clearInterval(textPrinter);
  }

  let textPrinter;
  useEffect(() => {
    setTextRead("");

    let textVal = feederArray[itterator2];
    if (textVal) {
      textArray = textVal.split("");
      if (textPrinting) {
        textPrinter = setInterval(printOutText, 40);
      } else {
        setTextRead(textVal);
      }
    }

    return () => cleanUp();
  }, [itterator2, textPrinting]);

  useEffect(() => {
    // let textVal = feederArray[itterator2];
    // setTextRead(textVal);

    console.log("huh", itterator2, characterX.value, textBoxY.value);

    if (itterator2 === 0) {
      setTimeout(() => {
        startCharacterAnimation();
      }, 400);

      setTimeout(() => {
        startTextBoxAnimation();
        setupText(0);
      }, 600);
    }

    if (itterator2 === 2) {
      moveMap({ lat: 50.03312256836453, lng: -125.27333546429873 });
      setTimeout(() => {
        DsSearchY.value = withTiming(windowHeight * 0.4);
        // startDsSearchButtonAnimation();
      }, 1000);
    }

    if (itterator2 === 3) {
      DsSearchY.value = withTiming(scale(-1000));
      // startDsSearchButtonAnimation();
      setSecondGuideModal(false);
    }

    if (itterator2 === 4) {
      setSecondGuideModal(true);
    }

    if (itterator2 === 5) {
      setSecondGuideModal(false);
    }

    if (itterator2 === 6) {
      setSecondGuideModal(true);
    }

    if (itterator2 === 8) {
      diveSiteY.value = withTiming(windowHeight * 0.4);
      // startDiveSiteAnimation();
    }

    console.log(itterator2)
    if (itterator2 === 9) {
      diveSiteY.value = withTiming(scale(-1000));
      // startDiveSiteAnimation();
      setSecondGuideModal(false);
    }

    if (itterator2 === 16) {
      setSecondGuideModal(false);
    }

    if (itterator2 === 18) {
      nextTutX.value = withSpring(windowWidth * 0.3);
      // startNextTutAnimation();
    }

    if (itterator2 === 19) {
      setAddSiteVals({
        Site: "",
        Latitude: "",
        Longitude: "",
        UserID: null,
      });
      nextTutX.value = withTiming(-300);
      // startNextTutAnimation();
      setDiveSiteAdderModal(false);
      setTutorialRunning(false);
    }

    if (itterator2 === feederArray.length - 1) {
      setTutorialRunning(false);
      setItterator2(null);
      setSecondGuideModal(false);
      startCharacterAnimation();
      startTextBoxAnimation();
    }
  }, [itterator2]);

  const characterSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: characterX.value }],
    };
  });

  const textBoxSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: textBoxY.value }],
    };
  });

  const DsSearchButtonSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: DsSearchY.value }],
    };
  });

  const diveSiteSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: diveSiteY.value }],
    };
  });

  const nextTutSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: nextTutX.value }],
    };
  });

  const startCharacterAnimation = () => {
    if (characterX.value === 1000) {
      characterX.value = withTiming(190);
    } else {
      characterX.value = withTiming(1000);
    }
  };

  const startTextBoxAnimation = () => {
    if (textBoxY.value === 1000) {
      textBoxY.value = withTiming(windowHeight * 0.85);
    } else {
      textBoxY.value = withTiming(1000);
    }
  };

  const startDsSearchButtonAnimation = () => {
    if (DsSearchY.value === scale(-1000)) {
      DsSearchY.value = withTiming(windowHeight * 0.4);
    } else {
      DsSearchY.value = withTiming(scale(-1000));
    }
  };

  const startDiveSiteAnimation = () => {
    if (diveSiteY.value === scale(-1000)) {
      diveSiteY.value = withTiming(windowHeight * 0.4);
    } else {
      diveSiteY.value = withTiming(scale(-1000));
    }
  };

  const startNextTutAnimation = () => {
    if (nextTutX.value === -300) {
      nextTutX.value = withSpring(windowWidth * 0.3);
    } else {
      nextTutX.value = withTiming(-300);
    }
  };

  useEffect(() => {
    if (tutorialRunning) {
      if (itterator2 === null) {
        setItterator2(0);
      }
    }
  }, [secondGuideModal]);

  const moveMap = (values) => {
    setMapCenter({ lat: values.lat, lng: values.lng });
  };

  return (
    <TouchableWithoutFeedback onPress={() => setupText(1)}>
      <View style={styles.wrapper}>
        <LinearGradient
          style={styles.container}
          colors={["transparent", "#538dbd"]}
          start={{ x: 0, y: 0 }}
        ></LinearGradient>

        <Animated.View style={[characterSlide, styles.character]}>
          <Image
            source={seaLionGuy}
            style={{
              height: windowWidth > 600 ? 700 : 400,
              width: windowWidth > 600 ? 740 : 420,
            }}
          />
        </Animated.View>

        <Animated.View style={[textBoxSlide, styles.textBox]}>
          <Text style={styles.textContain}>{textRead}</Text>
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, DsSearchButtonSlide]}>
          <MaterialCommunityIcons
            name="map-search-outline"
            color="aquamarine"
            size={scale(42)}
          />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, diveSiteSlide]}>
          <MaterialIcons
            name="add-location-alt"
            color="aquamarine"
            size={scale(42)}
          />
        </Animated.View>

        <Animated.View
          style={[styles.nextTutButton, nextTutSlide]}
          onPress={handleThirdTutorialStartup}
        >
          <Text onPress={handleThirdTutorialStartup} style={styles.nextTutText}>
            Photogenics
          </Text>
          <FontAwesome
            name="arrow-right"
            size={24}
            color="white"
            onPress={handleThirdTutorialStartup}
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    opacity: 0.9,
  },
  character: {
    position: "absolute",
    bottom:
      windowWidth > 600
        ? scale(-240)
        : Platform.OS === "ios"
        ? scale(-440)
        : scale(-370),
    left:
      windowWidth > 600
        ? scale(160)
        : Platform.OS === "ios"
        ? scale(30)
        : scale(0),
    height: "100%",
    width: "100%",
    opacity: 1,
  },
  textBox: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    alignSelf: "center",
    opacity: 1,
  },
  textContain: {
    padding: 10,
    fontFamily: "Itim_400Regular",
    fontSize: 14,
  },
  buttonwrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(50),
    position: "absolute",
    left: "20%",
    height: scale(50),
    width: scale(50),
    opacity: 1,
    backgroundColor: "black",
  },
  nextTutButton: {
    position: "absolute",
    flexDirection: "row",
    top: Platform.OS === "ios" ? "25%" : "25%",
    backgroundColor: "#538bdb",
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 2,
    height: "5%",
    marginRight: scale(10),
    marginLeft: scale(10),
    borderRadius: 15,
    borderColor: "lightgrey",
    borderWidth: 2,
  },
  nextTutText: {
    color: "white",
    fontFamily: "Itim_400Regular",
    fontSize: scale(12),
    margin: 10,
  },
});
