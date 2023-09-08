import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import mantaIOS from "../png/Manta32.png";
import seaLionGuy from "../png/seaLion.png";
import { TutorialModelContext } from "../contexts/tutorialModalContext";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { getRecentPhotos } from "../../supabaseCalls/photoSupabaseCalls";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { getPhotosforAnchorMulti } from "../../supabaseCalls/photoSupabaseCalls";
import { UserProfileContext } from "../contexts/userProfileContext";
import moment from "moment";
import { scale } from "react-native-size-matters";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { TutorialResetContext } from "../contexts/tutorialResetContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { ReverseContext } from "../contexts/reverseContext";
import { ChapterContext } from "../contexts/chapterContext";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import anchorClustIOS from "../png/ClusterAnchor24.png";
import anchorIconIOS from "../png/SiteAnchor20.png";
import heatIconIOS from "../png/heatpoint.png";
import arrowIOS from "../png/arrow.png";
import UserNamer from "./usernamer";

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
    }
  }, [tutorialReset]);

  useEffect(() => {
    console.log(chapter);
    setSiteModal(false);
    setMovingBack(false)
    resetTutorial();

    switch (chapter) {
      case "Getting around the map":
        setItterator(1);
        setGuideModal(true);
        characterX.value = withTiming(190)
        textBoxY.value = withTiming(windowHeight * 0.85);
        picX.value = withSpring(0);
        break;

      case "Dive sites":
        setItterator(6);
        setGuideModal(true);
        characterX.value = withTiming(190)
        textBoxY.value = withTiming(windowHeight * 0.85);
        clusterAnchorY.value = withTiming(windowHeight * 0.4);
        heatPotintY.value = withTiming(windowHeight * 0.25);
        nudgeMap({ lat: 49.3134161482923, lng: -124.242440499365 })
        break;

      case "Changed dive site":
        setItterator(12);
        setGuideModal(true);
        characterX.value = withTiming(190)
        textBoxY.value = withTiming(windowHeight * 0.85);
        arrowY.value = withTiming(windowWidth > 600 ? scale(-10) : scale(65));
        nudgeMap({ lat: 49.3134161482923, lng: -124.242440499365 })
        break;
    }

  }, [chapter]);

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
    picX.value = scale(-300);
    exploreButtonY.value = scale(-1000);
    clusterAnchorY.value = scale(-1200);
    heatPotintY.value = scale(-1200);
    arrowY.value = scale(-1200);
    userBoxX.value = scale(-300);
    nextTutX.value = scale(-300);
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
  const clusterAnchorY = useSharedValue(scale(-1200));
  const heatPotintY = useSharedValue(scale(-1200));
  const arrowY = useSharedValue(scale(-1200));
  const userBoxX = useSharedValue(scale(-300));
  const nextTutX = useSharedValue(scale(-300));

  const text0 =
    "Hi, welcome to DiveGo, I'm Emilio, I'm here to show you around.";
  const text1 =
    "First let's find a spot with some action. Here are 3 of the most recent sightings by other divers.";
  const text2 = "Choose one and let's see what else is there!";
  const text3 =
    "Great! We've moved the map, as you can see there is a lot more action here!";
  const text4 =
    "Normally to move the map, you can use the location search under this icon. Enter in the name of the location you want to hop over to and it will take you there.";
  const text5 =
    "Looking at the map you can now see a few things, namely these grey and blue anchors, the grey anchors are a cluster of dive sites...";
  const text6 = `The blue anchors are dive sites, try tapping on one and let's take a closer look! But make sure it has a heat point nearby, they look like this,      that means sea creatures have been spotted on that dive site.`;
  const text7 = "";
  const text8 =
    "Oops! Looks like you have chosen a dive site that doesn't have any sightings yet! Remember you want a dive site with a heat point       nearby. Close the form and try to find one with heat points.";
  const text9 =
    "Wow, cool! look at all the neat sea creatures divers have already seen at this site!";
  const text10 =
    "Now try closing the dive site and choose a creature or two from the pictures along the top, then come back to the dive site and see what's changed!";
  const text11 = "";
  const text12 = "Select one or more sea creatures using the menu at the top.";
  const text13 = "";
  const text14 =
    "Uh-oh! This isn't the dive site we were looking at before! Try to find the one we were looking at so we can see how it has changed.";
  const text15 =
    "As you can see, the photos have filtered to show only those creatures you have selected";
  const text16 =
    "Ok well that's all for this guide, in the next one I'll show you how to check if a dive site is in the app and if not, enable you to add it yourself!";
  const text17 =
    "In order to do that we will need to setup the rest of your profile, so can I ask you to choose your diver name before we go?";
  const text18 =
    "Thanks! And if you want to continue to the next guide please tap this button, if not tap anywhere else to exit, and thank you for joining DiveGo!";
  const text19 = "";

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
  ];

  const setupText = (pushVal) => {
    if (itterator === 8 && !textPrinting) {
      setItterator(7);
      setGuideModal(false);
      return;
    } else if (itterator === 14 && !textPrinting) {
      setItterator(13);
      setGuideModal(false);
      return;
    }
    if (
      itterator === 2 ||
      itterator === 7 ||
      itterator === 11 ||
      itterator === 13 ||
      itterator === 17 ||
      itterator >= 19
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
      if (itterator === 6 && textArray.length <= 64) {
        setTextRead2((prev) => prev + textArray[0]);
      } else if (itterator === 8 && textArray.length <= 63) {
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
      } else if (itterator === 6 && !textPrinting) {
        let val1 =
          Platform.OS === "ios" ? textVal.slice(0, 147) : textVal.slice(0, 145);
        let val2 =
          Platform.OS === "ios" ? textVal.slice(-64) : textVal.slice(-68);
        setTextRead(val1);
        setTextRead2(val2);
      } else if (itterator === 8 && !textPrinting) {
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
        characterX.value = withTiming(190);
        // startCharacterAnimation();
      }, 400);

      setTimeout(() => {
        textBoxY.value = withTiming(windowHeight * 0.85);
        // startTextBoxAnimation();
        setupText(0);
      }, 600);
    }

    console.log(itterator)
    if (itterator === 1) {
      picX.value = withSpring(0);
      // startPicAnimation();
    }

    if (itterator === 4) {
      exploreButtonY.value = withTiming(windowHeight * 0.4);
      // startExploreButtonAnimation();
    }

    if (itterator === 5) {
      exploreButtonY.value = withTiming(scale(-1000));
      clusterAnchorY.value = withTiming(windowHeight * 0.4);
      // startClusterAnchorAnimation();
    }

    if (itterator === 6) {
      heatPotintY.value = withTiming(windowHeight * 0.25);
      // startHeatPointAnimation();
    }

    if (itterator === 7) {
      console.log("& at all?", movingBack)
      if (movingBack) {
        setMovingBack(false);
        setGuideModal(false);
        return;
      } else {
        console.log("triggered 7?")
        setGuideModal(false);
        heatPotintY.value = withTiming(scale(-1200));
        // startHeatPointAnimation();
        clusterAnchorY.value = withTiming(scale(-1200));
        // startClusterAnchorAnimation();
      }
    }

    if (itterator === 8) {
      setTextPrinting(true);
      setMovingBack(true);
      setGuideModal(true);
    }

    if (itterator === 9) {
      setTextRead("");
      setTextPrinting(true);
    }

    if (itterator === 11) {
      setGuideModal(!guideModal);
    }

    if (itterator === 12) {
      arrowY.value = withTiming(windowWidth > 600 ? scale(-10) : scale(65));
      // startArrowAnimation();
    }

    if (itterator === 13) {
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

    if (itterator === 14) {
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

    if (itterator === 17) {
      getProfile();

      if (profile[0].UserName) {
        setItterator((prev) => prev + 1);
        return;
      }
      userBoxX.value = withSpring(windowWidth * 0.2);
      // startUserBoxAnimation();
    }

    if (itterator === 18) {
      getProfile();
      // if (userBoxX.value !== scale(-300)) {
        userBoxX.value = withTiming(scale(-300));
        // startUserBoxAnimation();
      // }

      nextTutX.value = withSpring(windowWidth * 0.3);
      // startNextTutAnimation();
    }

    if (itterator === 19) {
      setSiteModal(false);
      
      nextTutX.value = withTiming(scale(-300));
      // startNextTutAnimation();
    }

    if (itterator === feederArray.length - 1) {
      setItterator(null);
      setTutorialRunning(false);
      setGuideModal(false);
      characterX.value = withTiming(scale(1000));
      // startCharacterAnimation();
      textBoxY.value = withTiming(scale(1000));
      // startTextBoxAnimation();
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
      characterX.value = withTiming(190);
    } else {
      characterX.value = withTiming(scale(1000));
    }
  };

  const startTextBoxAnimation = () => {
    if (textBoxY.value === scale(1000)) {
      textBoxY.value = withTiming(windowHeight * 0.85);
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
    if (itterator === 1) {
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
                      <Image
                        source={{
                          uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${pic.photoFile}`,
                        }}
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
                height: scale(30),
                width: scale(30),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor1,
              {
                height: scale(30),
                width: scale(30),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor2,
              {
                height: scale(30),
                width: scale(30),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor3,
              {
                height: scale(30),
                width: scale(30),
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor4,
              {
                height: scale(30),
                width: scale(30),
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
    fontSize: 16,
  },
  container3: {
    // flex: 1,
    position: "absolute",
    top: Platform.OS === "ios" ? "9%" : "6%",
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
    top: Platform.OS === "ios" ? "15%" : "13%",
  },
  titleText: {
    textAlign: "center",
    fontFamily: "IndieFlower_400Regular",
    color: "#F0EEEB",
    fontSize: scale(15),
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
});
