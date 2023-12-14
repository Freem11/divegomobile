import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  interpolateColor,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import mantaIOS from "../png/Manta32.png";
import seaLionGuy from "../png/EmilioNeutral.png";
import { TutorialModelContext } from "../contexts/tutorialModalContext";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { getRecentPhotos } from "../../supabaseCalls/photoSupabaseCalls";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { getPhotosforAnchorMulti } from "../../supabaseCalls/photoSupabaseCalls";
import { UserProfileContext } from "../contexts/userProfileContext";
import moment from "moment";
import { scale, moderateScale } from "react-native-size-matters";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { TutorialResetContext } from "../contexts/tutorialResetContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { ReverseContext } from "../contexts/reverseContext";
import { ChapterContext } from "../contexts/chapterContext";
import { MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import anchorClustIOS from "../png/ClusterAnchor24.png";
import anchorIconIOS from "../png/SiteAnchor20.png";
import heatIconIOS from "../png/heatpoint.png";
import arrowIOS from "../png/arrow.png";
import UserNamer from "./usernamer";
import ImageCasher from "../helpers/imageCashing";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function IntroTutorial() {
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);
  const { selectedDiveSite, setSelectedDiveSite } = useContext(
    SelectedDiveSiteContext
  );
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);

  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { itterator, setItterator } = useContext(IterratorContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
  const { tutorialReset, setTutorialReset } = useContext(TutorialResetContext);
  const { movingBack, setMovingBack } = useContext(ReverseContext);
  const [backHappened, setBackHappened] = useState(false);

  const { setMapCenter } = useContext(MapCenterContext);

  const [pics, setPics] = useState([]);

  const [guideState, setGuideState] = useState(false);
  let counter = 0;
  let blinker;

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (tutorialReset && profile[0].UserName) {
      setItterator(null);
      setTutorialRunning(false);
      setGuideModal(false);
      setTutorialReset(false);
      setSiteModal(false);
      resetTutorial();
      setChapter(null);
    }
  }, [tutorialReset]);

  useEffect(() => {
    setMovingBack(false);

    switch (chapter) {
      case "Getting around the map":
        resetTutorial();
        setSiteModal(false);
        setItterator(6);
        setGuideModal(true);
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        textBoxY.value = withTiming(windowHeight * 0.8);
        picX.value = withSpring(0);
        break;

      case "Dive sites":
        resetTutorial();
        setSiteModal(false);
        setItterator(9);
        setGuideModal(true);
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        textBoxY.value = withTiming(windowHeight * 0.8);
        clusterAnchorY.value = withTiming(windowHeight * 0.4);
        heatPotintY.value = withTiming(windowHeight * 0.25);
        nudgeMap({ lat: 49.3134161482923, lng: -124.242440499365 });
        break;

      case "Changed dive site":
        resetTutorial();
        setSiteModal(false);
        setItterator(16);
        setGuideModal(true);
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        textBoxY.value = withTiming(windowHeight * 0.8);
        arrowY.value = withTiming(windowWidth > 600 ? scale(-10) : scale(65));
        if (selectedDiveSite.SiteName === ""){
          setSelectedDiveSite({
            SiteName: "Madrona Point",
            Latitude:  49.3134,
            Longitude: -124.2424,
          });
        }
        nudgeMap({ lat: 49.3134161482923, lng: -124.242440499365 });
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
      setTutorialReset(true);
    }
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
      console.log({ title: "Error", message: e.message });
    }
  };

  const getPhotos = async (today) => {
    try {
      const photos = await getRecentPhotos(today);
      if (photos) {
        setPics(photos);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const resetTutorial = async () => {
    characterX.value = scale(1000);
    textBoxY.value = scale(1000);
    guideButtonY.value = scale(-1200);
    questionButtonY.value = scale(-1000);
    picX.value = scale(-300);
    exploreButtonY.value = scale(-1000);
    clusterAnchorY.value = scale(-1200);
    heatPotintY.value = scale(-1200);
    arrowY.value = scale(-1200);
    userBoxX.value = scale(-300);
    nextTutX.value = scale(-300);
    clearUp();
  };

  const handleSecondTutorialStartup = () => {
    setItterator(null);
    setSiteModal(false);
    setTutorialRunning(true);
    setGuideModal(false);
    setSecondGuideModal(true);
  };

  const characterX = useSharedValue(scale(1000));
  const textBoxY = useSharedValue(scale(1000));
  const picX = useSharedValue(scale(-300));
  const exploreButtonY = useSharedValue(scale(-1000));
  const questionButtonY = useSharedValue(scale(-1000));
  const clusterAnchorY = useSharedValue(scale(-1200));
  const heatPotintY = useSharedValue(scale(-1200));
  const guideButtonY = useSharedValue(scale(-1200));
  const arrowY = useSharedValue(scale(-1200));
  const userBoxX = useSharedValue(scale(-300));
  const nextTutX = useSharedValue(scale(-300));

  const text0 =
    "Hi, welcome to Scuba SEAsons, I'm Emilio, I'm here to show you around.";
  const text1 =
    "First, what should I call you? This way, when you add a dive site or contribute a sea creature sighting we can put your name on it! ";
  const text2 =
    "Nice to meet you! Now that we are buddied up, let me first explain how my guide system works";
  const text3 =
    "In the top left you may have noticed this 'Guide Active' button, as long as you are in a guide it will be on screen if you tap on it a menu will open giving you the option to chapter skip to different parts of the guide you are currently in";
  const text4 =
    "The last option in the list on any of the guides is the 'Exit Guide' option which will let you jump out and explore on your own at any time";
  const text5 =
    "If you ever want to refer back to a guide (or miss me!) you can find me under this question mark button in the menu, from there you can open any of the guides";
  const text6 =
    "Ok thats the guide system, now let's find a spot with some action! Here are 3 recent sightings by other divers. Choose one and let's see what else is there!";
  const text7 =
    "Great! We've moved the map, as you can see there is a lot more action here!";
  const text8 =
    "Normally to move the map, you can use the location search under this icon. Enter in the name of the location you want to hop over to and it will take you there";
  const text9 =
    "Looking at the map you can now see a few things, namely these grey and blue anchors, the grey anchors are a cluster of dive sites...";
  const text10 = `The blue anchors are dive sites, try tapping on one and let's take a closer look! But make sure it has a heat point nearby, they look like this,      that means sea creatures have been spotted on that dive site.`;
  const text11 = "";
  const text12 =
    "Oops! Looks like you have chosen a dive site that doesn't have any sightings yet! Remember you want a dive site with a heat point       nearby. Close the form and try to find one with heat points.";
  const text13 =
    "Wow, cool! look at all the neat sea creatures divers have already seen at this site!";
  const text14 =
    "Now try closing the dive site and choose a creature or two from the pictures along the top, then come back to the dive site and see what's changed!";
  const text15 = "";
  const text16 = "Select one or more sea creatures using the menu at the top, a tap will highlight the selected sea creature yellow to indicate that it is selected but...";
  const text17 = "If you LONG press on one, you will see that it pops out for a better look! You can long press on another to swap them or long press on the popped out one to put it back, and yes you can still tap to select while its popped out!"
  const text18 = "";
  const text19 =
    "Uh-oh! This isn't the dive site we were looking at before! Try to find the one we were looking at so we can see how it has changed.";
  const text20 =
    "As you can see, the photos have filtered to show only those creatures you have selected";
  const text21 =
    "Ok well that's all for this guide, in the next one I'll show you how to check if a dive site is in the app and if not, enable you to add it yourself!";
  const text22 =
    "If you want to continue to the next guide please tap this button, if not tap anywhere else to exit, and thank you for joining Scuba SEAsons!";
  const text23 = "";

  const [textRead, setTextRead] = useState("");
  const [textRead2, setTextRead2] = useState("  ");
  const [textPrinting, setTextPrinting] = useState(true);
  const [anchPhotos, setAnchPhotos] = useState(null);
  const [backCount, setBackCount] = useState(0);

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
  ];

  const setupText = (pushVal) => {
    if (itterator === 12 && !textPrinting) {
      setItterator(11);
      setGuideModal(false);
      return;
    } else if (itterator === 19 && !textPrinting) {
      setItterator(18);
      setGuideModal(false);
      return;
    }
    if (
      itterator === 1 ||
      itterator === 6 ||
      itterator === 11 ||
      itterator === 15 ||
      itterator === 18 ||
      itterator >= 23
    ) {
      return;
    } else {
      if (pushVal === 1 && itterator < feederArray.length - 1) {
        if (textPrinting) {
          setTextPrinting(false);
          textArray = "";
          setTextRead("");
          setTextRead(feederArray[itterator]);
        } else {
          setItterator((prev) => prev + pushVal);
          setTextPrinting(true);
        }
      }

      if (pushVal === 1 && itterator === feederArray.length - 1) {
        setGuideModal(false);
      }
    }
  };

  let textArray;

  function printOutText() {
    if (textArray.length > 0) {
      if (itterator === 10 && textArray.length <= 64) {
        setTextRead2((prev) => prev + textArray[0]);
      } else if (itterator === 12 && textArray.length <= 63) {
        setTextRead2((prev) => prev + textArray[0]);
      } else {
        setTextRead((prev) => prev + textArray[0]);
      }
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
    setTextRead2("");
    let textVal = feederArray[itterator];
    if (textVal) {
      textArray = textVal.split("");
      if (textPrinting) {
        textPrinter = setInterval(printOutText, 40);
      } else if (itterator === 10 && !textPrinting) {
        let val1 =
          Platform.OS === "ios" ? textVal.slice(0, 147) : textVal.slice(0, 145);
        let val2 =
          Platform.OS === "ios" ? textVal.slice(-64) : textVal.slice(-68);
        setTextRead(val1);
        setTextRead2(val2);
      } else if (itterator === 12 && !textPrinting) {
        let val1 =
          Platform.OS === "ios" ? textVal.slice(0, 133) : textVal.slice(0, 131);
        let val2 =
          Platform.OS === "ios" ? textVal.slice(-62) : textVal.slice(-65);
        setTextRead(val1);
        setTextRead2(val2);
      } else {
        setTextRead(textVal);
      }
    }

    return () => cleanUp();
  }, [itterator, textPrinting]);

  useEffect(() => {
    if (itterator === 0) {
      setTimeout(() => {
        characterX.value = withTiming(
          Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
        );
        // startCharacterAnimation();
      }, 400);

      setTimeout(() => {
        textBoxY.value = withTiming(windowHeight * 0.8);
        // startTextBoxAnimation();
        setupText(0);
      }, 600);
    }

    if (itterator === 1) {
      getProfile();

      if (profile[0].UserName) {
        setItterator((prev) => prev + 1);
        return;
      }
      userBoxX.value = withSpring(windowWidth * 0.2);
      // startUserBoxAnimation();
    }

    if (itterator === 2) {
      getProfile();
      // if (userBoxX.value !== scale(-300)) {
      userBoxX.value = withTiming(scale(-300));
      Keyboard.dismiss();
      // startUserBoxAnimation();
      // }
      // startPicAnimation();
    }

    if (itterator === 3) {
      blinker = setInterval(guideBut, 1500);
      guideButtonY.value = withTiming(windowHeight * 0.4);
    }

    if (itterator === 4) {
      guideButtonY.value = withTiming(scale(-1000));
      clearUp();
    }

    if (itterator === 5){
      questionButtonY.value = withTiming(windowHeight * 0.4);
    }

    console.log("i am", itterator)
    if (itterator === 6) {
      questionButtonY.value = withTiming(scale(-1000));
      picX.value = withSpring(0);
    }

    if (itterator === 8) {
      exploreButtonY.value = withTiming(windowHeight * 0.4);
      // startExploreButtonAnimation();
    }

    if (itterator === 9) {
      exploreButtonY.value = withTiming(scale(-1000));
      clusterAnchorY.value = withTiming(windowHeight * 0.4);
      // startClusterAnchorAnimation();
    }

    if (itterator === 10) {
      heatPotintY.value = withTiming(windowHeight * 0.25);
      // startHeatPointAnimation();
    }

    if (itterator === 11) {
      if (movingBack) {
        setMovingBack(false);
        setGuideModal(false);
        return;
      } else {
        setGuideModal(false);
        heatPotintY.value = withTiming(scale(-1200));
        // startHeatPointAnimation();
        clusterAnchorY.value = withTiming(scale(-1200));
        // startClusterAnchorAnimation();
      }
    }

    if (itterator === 12) {
      setTextPrinting(true);
      setMovingBack(true);
      setGuideModal(true);
    }

    if (itterator === 13) {
      setTextRead("");
      setTextPrinting(true);
    }

    if (itterator === 14) {
      setChapter(null);
    }

    if (itterator === 15) {
      setGuideModal(false);
    }

    if (itterator === 16) {
      setGuideModal(true);
      arrowY.value = withTiming(windowWidth > 600 ? scale(-10) : scale(65));
      // startArrowAnimation();
    }

    if (itterator === 18) {
      if (movingBack) {
        setMovingBack(false);
        setGuideModal(false);
        setBackHappened(false);
        return;
      } else {
        setGuideModal(false);
        arrowY.value = withTiming(scale(-1200));
        // startArrowAnimation();
      }
    }

    if (itterator === 19) {
      if (backCount === 0) {
        arrowY.value = withTiming(scale(-1200));
        // startArrowAnimation();
        setBackCount((prev) => prev + 1);
      }
      if (backHappened) {
        setTextPrinting(true);
        setMovingBack(true);
        // -------------------------
        setGuideModal(true);
      } else {
        setTextPrinting(true);
        setMovingBack(true);
        setGuideModal(true);
        setBackHappened(true);
      }
    }

    if (itterator === 20) {
      setGuideModal(true);
    }

    if (itterator === 22) {
      nextTutX.value = withSpring(windowWidth * 0.3);
      // startNextTutAnimation();
    }

    if (itterator === 23) {
      setSiteModal(false);
      nextTutX.value = withTiming(scale(-300));
      // startNextTutAnimation();
    }

    if (itterator === feederArray.length - 1) {
      setItterator(null);
      setTutorialRunning(false);
      setGuideModal(false);
      characterX.value = withTiming(
        Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
      );
      // startCharacterAnimation();
      textBoxY.value = withTiming(scale(1000));
      // startTextBoxAnimation();
      setChapter(null);
      setBackHappened(false);
      setMovingBack(false);
      setBackCount(0);
    }
  }, [itterator]);

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

  const guideButtonSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: guideButtonY.value }],
    };
  });

  const questionButtonSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: questionButtonY.value }],
    };
  });

  const picSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: picX.value }],
    };
  });

  const exporeButtonSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: exploreButtonY.value }],
    };
  });

  const clusterAnchorSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: clusterAnchorY.value }],
    };
  });

  const heatPointSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: heatPotintY.value }],
    };
  });

  const arrowSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: arrowY.value }],
    };
  });

  const userBoxSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: userBoxX.value }],
    };
  });

  const nextTutSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: nextTutX.value }],
    };
  });

  const startCharacterAnimation = () => {
    if (characterX.value === scale(1000)) {
      characterX.value = withTiming(
        Platform.OS === "ios" ? windowWidth * 0.2 : windowWidth * 0.26
      );
    } else {
      characterX.value = withTiming(1000);
    }
  };

  const startTextBoxAnimation = () => {
    if (textBoxY.value === scale(1000)) {
      textBoxY.value = withTiming(windowHeight * 0.8);
    } else {
      textBoxY.value = withTiming(scale(1000));
    }
  };

  const startPicAnimation = () => {
    if (picX.value === scale(-300)) {
      picX.value = withSpring(0);
    } else {
      picX.value = withTiming(scale(-300));
    }
  };

  const startExploreButtonAnimation = () => {
    if (exploreButtonY.value === scale(-1000)) {
      exploreButtonY.value = withTiming(windowHeight * 0.4);
    } else {
      exploreButtonY.value = withTiming(scale(-1000));
    }
  };

  const startClusterAnchorAnimation = () => {
    if (clusterAnchorY.value === scale(-1200)) {
      clusterAnchorY.value = withTiming(windowHeight * 0.4);
    } else {
      clusterAnchorY.value = withTiming(scale(-1200));
    }
  };

  const startHeatPointAnimation = () => {
    if (heatPotintY.value === scale(-1200)) {
      heatPotintY.value = withTiming(windowHeight * 0.25);
    } else {
      heatPotintY.value = withTiming(scale(-1200));
    }
  };

  const startArrowAnimation = () => {
    if (arrowY.value === scale(-1200)) {
      arrowY.value = withTiming(windowWidth > 600 ? -50 : 40);
    } else {
      arrowY.value = withTiming(scale(-1200));
    }
  };

  const startUserBoxAnimation = () => {
    if (userBoxX.value === scale(-300)) {
      userBoxX.value = withSpring(windowWidth * 0.2);
    } else {
      userBoxX.value = withTiming(scale(-300));
      Keyboard.dismiss();
    }
  };

  const startNextTutAnimation = () => {
    if (nextTutX.value === scale(-300)) {
      nextTutX.value = withSpring(windowWidth * 0.3);
    } else {
      nextTutX.value = withTiming(scale(-300));
    }
  };

  useEffect(() => {
    filterAnchorPhotos();
  }, [selectedDiveSite]);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      const photos = await getPhotosforAnchorMulti({
        animalMultiSelection,
        // sliderVal,
        minLat,
        maxLat,
        minLng,
        maxLng,
      });
      if (photos) {
        let count = 0;
        photos.forEach((obj) => {
          count++;
        });
        setAnchPhotos(count);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    if (tutorialRunning) {
      if (itterator === null) {
        setItterator(0);
      }
    }

    let today = new Date();
    let formattedDate = moment(today).format("YYYY-MM-DD");
    getPhotos(formattedDate);
  }, [guideModal]);

  const moveMap = (values) => {
    setMapCenter({ lat: values.lat, lng: values.lng });

    let hopper = 0;
    if (itterator === 2) {
      hopper = 2;
    } else {
      hopper = 1;
    }
    setItterator((prev) => prev + hopper);
    picX.value = withTiming(scale(-300));
    // startPicAnimation();
  };

  const nudgeMap = (values) => {
    setMapCenter({ lat: values.lat, lng: values.lng });
  };

  const progress = useDerivedValue(() => {
    return withTiming(guideState === true ? 1 : 0);
  });

  const guideButtonPulse = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        styles.guideButton.backgroundColor,
        styles.guideButtonAlt.backgroundColor,
      ]
    );
    return {
      backgroundColor,
    };
  });

  function guideBut() {
    counter++;
    if (counter % 2 == 0) {
      setGuideState(false);
    } else {
      setGuideState(true);
    }
  }

  function clearUp() {
    clearInterval(blinker);
    setGuideState(false);
  }

  return (
    <TouchableWithoutFeedback onPress={() => setupText(1)}>
      <View style={styles.wrapper}>
        <LinearGradient
          style={styles.container}
          colors={["transparent", "#538dbd"]}
          start={{ x: 0, y: 0 }}
        ></LinearGradient>

        <View style={styles.container3}>
          {pics &&
            pics.map((pic) => {
              return (
                <TouchableWithoutFeedback
                  key={pic.id}
                  onPress={() =>
                    moveMap({ lat: pic.latitude, lng: pic.longitude })
                  }
                >
                  <Animated.View
                    key={pic.id}
                    style={[styles.picContainer3, picSlide]}
                  >
                    <View style={styles.micro}>
                      <Text style={styles.titleText}>{pic.label}</Text>
                    </View>
                    <View style={styles.shadowbox}>
                      <ImageCasher
                        photoFile={pic.photoFile}
                        id={pic.id}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 15,
                          borderColor: "grey",
                        }}
                      />
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              );
            })}
        </View>

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
          <Text style={styles.textContain}>
            {textRead}
            <View
              style={{
                opacity: textRead2.length > 2 ? 1 : 0,
                marginRight: -10,
                marginBottom: -15,
                // backgroundColor: "green",
              }}
            >
              <Image source={heatIconIOS} style={styles.honkCon} />
            </View>
            {textRead2}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, exporeButtonSlide]}>
          <MaterialIcons name="explore" color="aquamarine" size={scale(42)} />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, questionButtonSlide]}>
          <FontAwesome5 name="question" color="aquamarine" size={scale(31)} />
        </Animated.View>

        <Animated.View style={[styles.userContainer, userBoxSlide]}>
          <UserNamer></UserNamer>
        </Animated.View>

        <Animated.View
          style={[styles.anchorClusterWrapper, clusterAnchorSlide]}
        >
          <Image
            source={anchorClustIOS}
            style={[
              styles.anchorclust,
              {
                height: scale(31),
                width: scale(31),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor1,
              {
                height: scale(28),
                width: scale(28),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor2,
              {
                height: scale(28),
                width: scale(28),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor3,
              {
                height: scale(28),
                width: scale(28),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor4,
              {
                height: scale(28),
                width: scale(28),
              },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.heatPointWrapper, heatPointSlide]}>
          <Image
            source={heatIconIOS}
            style={[
              styles.anchor4,
              {
                height: scale(50),
                width: scale(50),
              },
            ]}
          />
        </Animated.View>

        <Animated.View style={[styles.arrowWrapper, arrowSlide]}>
          <Image
            source={arrowIOS}
            style={[
              styles.anchor4,
              {
                height: scale(90),
                width: scale(200),
              },
            ]}
          />
        </Animated.View>

        <Animated.View
          style={[styles.nextTutButton, nextTutSlide]}
          onPress={handleSecondTutorialStartup}
        >
          <Text
            onPress={handleSecondTutorialStartup}
            style={styles.nextTutText}
          >
            Fun With Dive Sites
          </Text>
          <FontAwesome
            name="arrow-right"
            size={24}
            color="white"
            onPress={handleSecondTutorialStartup}
          />
        </Animated.View>

        <Animated.View
          style={[styles.guideButton, guideButtonPulse, guideButtonSlide]}
        >
          <Text style={guideState ? styles.guideTextAlt : styles.guideText}>
            Guide Active
          </Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    // backgroundColor: "pink"
  },
  container: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  character: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? "-10%" : "-7%",
    right: Platform.OS === "ios" ? "-10%" : "-4%",
    height: scale(400),
    width: scale(300),
    opacity: 1,
    // backgroundColor: "green"
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
  container3: {
    // flex: 1,
    position: "absolute",
    top: Platform.OS === "ios" ? "12%" : "9%",
    backgroundColor: "transparent",
    alignItems: "center",
    // marginTop: "-3%",
    height: "90%",
    marginRight: scale(10),
    marginLeft: scale(10),
    borderRadius: 15,
    // backgroundColor: "green"
  },
  picContainer3: {
    width: windowWidth > 600 ? scale(160) : scale(200),
    height: windowWidth > 600 ? scale(80) : scale(100),
    marginBottom: scale(5),
    // backgroundColor: "538bdb",
    marginTop: "-0%",
    borderRadius: 15,
    zIndex: 10,
  },
  userContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? "20%" : "20%",
    backgroundColor: "transparent",
    alignItems: "center",
    // marginTop: "-3%",
    height: "90%",
    marginRight: scale(10),
    marginLeft: scale(10),
    borderRadius: 15,
    // backgroundColor: "green"
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
  shadowbox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
  },
  micro: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    backgroundColor: "black",
    opacity: 0.6,
    width: "96%",
    borderRadius: 5,
    zIndex: 2,
    left: "5%",
    top: Platform.OS === "ios" ? (windowWidth > 600 ? "12%" : "10%") : "13%",
  },
  titleText: {
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(13),
    marginLeft: scale(10),
  },
  buttonwrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(50),
    position: "absolute",
    left: "20%",
    height: scale(45),
    width: scale(45),
    opacity: 1,
    backgroundColor: "black",
  },
  anchorClusterWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(50),
    position: "absolute",
    left: "20%",
    height: scale(50),
    width: scale(50),
    opacity: 1,
  },
  anchorclust: {
    position: "absolute",
    left: windowWidth * 0.025,
  },
  anchor1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth * 0.13,
    top: scale(-40),
    height: scale(45),
    width: scale(45),
    opacity: 1,
    marginBottom: 15,
  },
  anchor2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth * -0.09,
    top: scale(-40),
    height: scale(45),
    width: scale(45),
    opacity: 1,
    marginBottom: 15,
  },
  anchor3: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth * -0.09,
    top: scale(60),
    height: scale(45),
    width: scale(45),
    opacity: 1,
    marginBottom: 15,
  },
  anchor4: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth * 0.13,
    top: scale(60),
    height: scale(45),
    width: scale(45),
    opacity: 1,
    marginBottom: 15,
  },
  anchorSpec: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    // left: windowWidth * 0.13,
    top: scale(-10),
    height: scale(25),
    width: scale(25),
    opacity: 1,
    marginTop: -25,
  },
  heatPointWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(50),
    position: "absolute",
    left: "50%",
    height: scale(50),
    width: scale(50),
    opacity: 1,
  },
  arrowWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth > 600 ? "-20%" : "2%",
    height: scale(110),
    width: scale(160),
    opacity: 1,
  },
  honkCon: {
    height: 25,
    width: 25,
    borderRadius: 10,
    // backgroundColor: "blue",
    marginRight: -10,
    marginBottom: -2,
  },
  guideButton: {
    position: "absolute",
    left: scale(50),
    height: scale(35),
    width: scale(90),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "maroon",
    borderRadius: scale(15),
    paddingRight: 5,
    paddingLeft: 5,
  },
  guideButtonAlt: {
    position: "absolute",
    left: scale(50),
    height: scale(30),
    width: scale(80),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C49102",
    borderRadius: scale(15),
    paddingRight: 5,
    paddingLeft: 5,
  },
  guideText: {
    color: "darkgrey",
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(15),
  },
  guideTextAlt: {
    color: "black",
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(15),
  },
});
