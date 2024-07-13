import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import mantaIOS from "../png/Manta32.png";
import seaLionGuy from "../png/EmilioNeutral.png";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { UserProfileContext } from "../contexts/userProfileContext";
import { scale, moderateScale } from "react-native-size-matters";
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
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SecondTutorial() {
  const { fullScreenModal, setFullScreenModal } = useContext(FullScreenModalContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { activeTutorialID, setActiveTutorialID } = useContext(
    ActiveTutorialIDContext
  );
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

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
      setLargeModal(false);
      setTutorialRunning(false);
      setFullScreenModal(false);
      setTutorialReset(false);
      resetTutorial();
      setChapter(null);
    }
  }, [tutorialReset]);

  useEffect(() => {
    setLargeModal(false);
    resetTutorial();

    switch (chapter) {
      case "Checking for a dive site":
        setItterator2(1);
        setFullScreenModal(true);
        setActiveTutorialID("SecondGuide");
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        textBoxY.value = withTiming(windowHeight * 0.8);
        // setChapter(null);
        break;

      case "Adding your dive sites":
        setItterator2(8);
        setFullScreenModal(true);
        setActiveTutorialID("SecondGuide");
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        textBoxY.value = withTiming(windowHeight * 0.8);
        // setChapter(null);
        break;

      case "DS Help":
        setItterator2(10);
        setFullScreenModal(true);
        setActiveTutorialID("SecondGuide");
        setLargeModal(false);
        setTutorialRunning(true)
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        textBoxY.value = withTiming(windowHeight * 0.8);
        // setChapter(null);
        break;

      case "Placing the pin":
        setItterator2(15);
        setFullScreenModal(true);
        setActiveTutorialID("SecondGuide");
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        textBoxY.value = withTiming(windowHeight * 0.77);
        setLargeModal(false);
        // setChapter(null);
        break;

      case "Exit Guide":
        handleClearTutorial();
        break;
    }
  }, [chapter]);

  const handleClearTutorial = async () => {
    let profileCheck = await getProfile();
    let bully;

    if (profile) {
      bully = profile[0].UserName;
    } else {
      bully = "";
    }

    if (bully == null || bully === "") {
      return;
    } else {
      console.log("hit here")
      setTutorialReset(true);
    }
  };
  
  const resetTutorial = async () => {
    characterX.value = 1000;
    textBoxY.value = 1000;
    DsSearchY.value = scale(-1000);
    diveSiteY.value = scale(-1000);
    locationY.value = scale(-1000);
    pinY.value = scale(-1000); 
    mantaY.value = scale(-1200);
    nextTutX.value = -300;
    setAddSiteVals({
      ...addSiteVals,
      Site: "",
      Latitude: "",
      Longitude: "",
    });
  };

  const getProfile = async () => {
    let sessionUserId = activeSession.user.id;
    // let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
    try {
      const success = await grabProfileById(sessionUserId);
      if (success) {
        setProfile(success);
      }
    } catch (e) {
      console.log({ title: "Error16", message: e.message });
    }
  };

  const handleThirdTutorialStartup = () => {
    setItterator2(null);
    setLargeModal(false);
    setTutorialRunning(true);
    // setFullScreenModal(!fullScreenModal);
    setActiveTutorialID("ThirdGuide");
    
  };

  const characterX = useSharedValue(1000);
  const textBoxY = useSharedValue(1000);
  const DsSearchY = useSharedValue(scale(-1000));
  const diveSiteY = useSharedValue(scale(-1000));
  const locationY = useSharedValue(scale(-1000));
  const pinY = useSharedValue(scale(-1000));
  const mantaY = useSharedValue(scale(-1200));
  const nextTutX = useSharedValue(-300);

  const text0 =
    "Hey welcome back! Now that you have a Diver Name, I can show you how you can contribute to Scuba SEAsons!";
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
    "This is the dive site adding form, here, you can see 3 fields and a couple of buttons. First is the site name, add the dive site name in this spot";
  const text11 =
    "Next are the GPS lat and lng fields, there are 3 ways you can add them. The first is manually if you have the decimal format GPS coordinates simply add them to the fields and your good to go!"; 
  const text12 = 
    "The second way is using the location button, it’s this one. Tapping it will take your device’s current location and use that to create GPS coordinates for the dive site. Try it out now!";
  const text13 = "";
  const text14 = 
    "Nice! As you can see tapping the location button has produced GPS coordinates for your current location!";
  const text15 =
   "Next, assuming neither of these options will fit your situation there is one more, using this Pin Dropper button to open up the map so we can drop a pin, let’s try it";
  const text16 = "";
  const text17 = 
    "As you can see we are now back on the map and there is a new icon that looks like a manta ray, this is our draggable pin";
  const text18 =
    "Simply press on and drag the manta pin to to place it where you dive site is meant to be and then tap the 'set pin' button at the bottom";
  const text19 = "";
  const text20 =
    "As you can see Scuba SEAsons has taken the location of the pin you set and has given us its GPS coordinates!";
  const text21 =
    "Now that you have your GPS fields filled out add the site name in the top field and then tap the 'Submit Dive Site' button at the bottom and your site will be submitted for review";
  const text22 =
    "Please note your new site won't automatically be added to the map, the Scuba SEAsons team will verify your submission before committing to the map, but after that your site will go in and be credited to you with your diver name that we setup earlier!";

  const text23 = "";

  const text24 =
    "Nice Job, That's how you add a new dive site to Scuba SEAsons! In this case, since this is a guide, the entry was not submitted, but you can add from now on, in the same way";
  
  const text25 =
    "That's it for adding dive sites to the app! In the next guide we will look at adding sea creature sighting photos! Tap on this button to go to that guide next, otherwise tap anywhere else to close, and thanks for joining me again!";

  const text26 = "";

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
    text20,
    text21,
    text22,
    text23,
    text24,
    text25,
    text26,
  ];

  //  var interval;

  const setupText = (pushVal) => {
    if (
      itterator2 === 3 ||
      itterator2 === 5 ||
      itterator2 === 9 ||
      itterator2 === 13 ||
      itterator2 === 16 ||
      itterator2 === 23 ||
      itterator2 >= 26
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
        setFullScreenModal(false);
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
      setFullScreenModal(false);
    }

    if (itterator2 === 4) {
      setFullScreenModal(true);
      setActiveTutorialID("SecondGuide");
    }

    console.log(itterator2, fullScreenModal, largeModal)

    if (itterator2 === 5) {
      setChapter(null);
      setTimeout(() => {
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
      }, 400);

      setTimeout(() => {
        textBoxY.value = withTiming(windowHeight * 0.8);
        setupText(0);
      }, 600);
      setFullScreenModal(false);
    }

    if (itterator2 === 6) {
      setFullScreenModal(true);
      setActiveTutorialID("SecondGuide");
    }

    if (itterator2 === 8) {
      diveSiteY.value = withTiming(windowHeight * 0.4);
      // startDiveSiteAnimation();
    }

    if (itterator2 === 9) {
      setChapter(null);
      setTimeout(() => {
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
      }, 400);

      setTimeout(() => {
        textBoxY.value = withTiming(windowHeight * 0.8);
        setupText(0);
      }, 600);
      diveSiteY.value = withTiming(scale(-1000));
      // startDiveSiteAnimation();
      setFullScreenModal(false);
    }

    if (itterator2 === 10) {
      moveMap({ lat: 50.03312256836453, lng: -125.27333546429873 });
    }

    if (itterator2 === 12) {
      locationY.value =  withTiming(windowHeight * 0.4);
    }

    if (itterator2 === 13) {
      locationY.value =  withTiming(scale(-1000));
      setFullScreenModal(false)
    }

    if (itterator2 === 14) {
      setFullScreenModal(true)
      setActiveTutorialID("SecondGuide");
    }

    if (itterator2 === 15) {
      pinY.value = withTiming(windowHeight * 0.4);
    }

    if (itterator2 === 16) {
      pinY.value =  withTiming(scale(-1000));
      setFullScreenModal(false)
    }

    if (itterator2 === 17) {
      setLargeModal(false);
      setFullScreenModal(true);
      setActiveTutorialID("SecondGuide");
      setTimeout(() => {
        mantaY.value = withTiming(windowHeight * 0.4);
        // startMantaAnimation();
      }, 1000);
    }

    if (itterator2 === 19) {
      setFullScreenModal(false);
      mantaY.value = withTiming(scale(-1200));
    }

    if (itterator2 === 20) {
      setFullScreenModal(true);
      setActiveTutorialID("SecondGuide");
    }

    if (itterator2 === 23) {
      setFullScreenModal(false);
    }

    if (itterator2 === 24) {
      setFullScreenModal(true);
      setActiveTutorialID("SecondGuide");
    }

    if (itterator2 === 25) {
      nextTutX.value = withSpring(windowWidth * 0.3);
    }

    if (itterator2 === 26) {
      setAddSiteVals({
        ...addSiteVals,
        Site: "",
        Latitude: "",
        Longitude: "",
      });
      nextTutX.value = withTiming(-300);
      setLargeModal(false);
      setTutorialRunning(false);
    }

    if (itterator2 === feederArray.length - 1) {
      setTutorialRunning(false);
      setItterator2(null);
      setFullScreenModal(false);
      startCharacterAnimation();
      startTextBoxAnimation();
      setChapter(null);
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

  const locationSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: locationY.value }],
    };
  });

  const pinSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: pinY.value }],
    };
  });

  const mantaSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: mantaY.value }],
    };
  });

  const nextTutSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: nextTutX.value }],
    };
  });

  const startCharacterAnimation = () => {
    if (characterX.value === 1000) {
      characterX.value = withTiming(
        Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
      );
    } else {
      characterX.value = withTiming(1000);
    }
  };

  const startTextBoxAnimation = () => {
    if (textBoxY.value === 1000) {
      textBoxY.value = withTiming(windowHeight * 0.8);
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

        <Animated.View
          style={[characterSlide, styles.character]}
          pointerEvents={"box-none"}
        >
          <Image
            source={seaLionGuy}
            style={{
              height: "100%",
              width: "100%",
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

        <Animated.View style={[styles.buttonwrapper, locationSlide]}>
          <MaterialIcons name="my-location" color="gold" size={scale(42)} />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, pinSlide]}>
          <MaterialIcons name="location-pin" color="gold" size={scale(42)} />
        </Animated.View>

        <Animated.View style={[styles.mantaWrapper, mantaSlide]}>
          <Image
            source={mantaIOS}
            style={[
              styles.mantaWrapper,
              {
                height: scale(60),
                width: scale(50),
              },
            ]}
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
    bottom: Platform.OS === "ios" ? "-10%" : "-7%",
    right: Platform.OS === "ios" ? "-10%" : "-4%",
    height: scale(400),
    width: scale(300),
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
    fontSize: moderateScale(14),
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
  mantaWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "20%",
    height: 50,
    width: 50,
    opacity: 1,
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
    height: scale(15),
    margin: 10,
  },
});
