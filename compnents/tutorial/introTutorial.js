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
import { getRecentPhotos } from "../../supabaseCalls/photoSupabaseCalls";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { UserProfileContext } from "../contexts/userProfileContext";
import moment from "moment";
import { scale } from "react-native-size-matters";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { MaterialIcons } from "@expo/vector-icons";
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

  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { setMapCenter } = useContext(MapCenterContext);

  const [pics, setPics] = useState([]);

  useEffect(() => {
    getProfile();
  }, []);

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

  const characterX = useSharedValue(1000);
  const textBoxY = useSharedValue(1000);
  const picX = useSharedValue(-300);
  const exploreButtonY = useSharedValue(-1000);
  const clusterAnchorY = useSharedValue(-1200);
  const heatPotintY = useSharedValue(-1200);
  const arrowY = useSharedValue(-1200);
  const userBoxX = useSharedValue(-300);

  const text0 = "Hi, welcome to SEAsons, I'm XXX, I'm here to show you around.";
  const text1 =
    "First let's find a spot with some action. Here are 3 of the most recent sightings by other divers.";
  const text2 = "Choose one and let's see what else is there!";
  const text3 =
    "Great! We've moved the map, as you can see there is a lot more action here!";
  const text4 =
    "Normally to move the Map, you can use the location search under this icon. Enter in the name of the location you want to hop over to and it will take you there.";
  const text5 =
    "Looking at the map you can now see a few things, namely these grey and blue anchors, the grey anchors are a cluster of dive sites...";
  const text6 =
    "The blue anchors are dive sites try tapping on one and lets take a closer look! But make sure it has a heat point nearby, they look like this, that means sea creatures have been spotted on that dive site.";
  const text7 = "";
  const text8 =
    "Wow, cool! look at all the neat sea creatures divers have already seen here by other divers!";
  const text9 =
    "Now try closing the dive site and chose a creature or two from the pictures along the top, then come back to the dive site and see what's changed!";
  const text10 = "";
  const text11 = "Select one or more sea creatures using the menu at the top.";
  const text12 = "";
  const text13 =
    "As you can see the photos have filtered to show only those creatures you have selected";
  const text14 =
    "Ok well that's all for this guide, in the next one i'll show you how to check if a dive site is in the app and if not, enable you to add it yourself!";
  const text15 =
    "In order to do that we will need to setup the rest of your profile, so can I ask you to choose your diver name before we go?";
  const text16 =
    "Thanks! And if you want to continue to the next guide please tap this button, if not tap anywhere else to exit, and thank you for joining SEAsons!";
  const text17 = "";

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
  ];

  //  var interval;

  const setupText = (pushVal) => {
    if (
      itterator === 2 ||
      itterator == 7 ||
      itterator == 10 ||
      itterator == 12 ||
      itterator == 15 ||
      itterator >= 17
    ) {
      return;
    } else {
      if (pushVal === 1 && itterator < feederArray.length - 1) {
        if (textPrinting) {
          setTextPrinting(false);
          textArray= ""
          setTextRead("")
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

      if (textArray.length > 0){
        setTextRead((prev) => prev + textArray[0]);
        textArray = textArray.slice(1);
      } else {
        setTextPrinting(false)
      }
    
  }

  function cleanUp() {
    clearInterval(textPrinter);
  }

  let textPrinter 
  useEffect(() => {
    setTextRead("");
    
      let textVal = feederArray[itterator];
      if (textVal){
        textArray = textVal.split("");
        if (textPrinting) {
         textPrinter = setInterval(printOutText, 40);
        } else {
          setTextRead(textVal);
        }
      
      }
     

    return () => cleanUp();
  }, [itterator, textPrinting]);

  useEffect(() => {
    // let textVal = feederArray[itterator];
    // setTextRead(textVal);

    if (itterator === 0) {
      setTimeout(() => {
        startCharacterAnimation();
      }, 400);

      setTimeout(() => {
        startTextBoxAnimation();
        setupText(0);
      }, 600);
    }

    if (itterator === 1) {
      startPicAnimation();
    }

    if (itterator === 4 || itterator === 5) {
      startExploreButtonAnimation();
    }

    if (itterator === 5 || itterator === 7) {
      startClusterAnchorAnimation();
    }

    if (itterator === 6 || itterator === 7) {
      startHeatPointAnimation();
    }

    if (itterator === 7) {
      startCharacterAnimation();
      startTextBoxAnimation();
      setGuideModal(!guideModal);
    }

    if (itterator === 8) {
      startCharacterAnimation();
      startTextBoxAnimation();
    }

    if (itterator === 10 || itterator === 12) {
      setGuideModal(!guideModal);
    }

    if (itterator === 11 || itterator === 12) {
      startArrowAnimation();
    }

    if (itterator === 15 || itterator === 16) {
      getProfile();
      if (profile[0].UserName) {
        setItterator(16);
        return;
      }
      startUserBoxAnimation();
    }

    if (itterator === 17) {
      setSiteModal(!siteModal);
    }

    if (itterator === feederArray.length - 1) {
      setItterator(null);
      setTutorialRunning(false);
      setGuideModal(false);
      startCharacterAnimation();
      startTextBoxAnimation();
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

  const startCharacterAnimation = () => {
    if (characterX.value === 1000) {
      characterX.value = withTiming(190);
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

  const startPicAnimation = () => {
    if (picX.value === -300) {
      picX.value = withSpring(0);
    } else {
      picX.value = withTiming(-300);
    }
  };

  const startExploreButtonAnimation = () => {
    if (exploreButtonY.value === -1000) {
      exploreButtonY.value = withTiming(windowHeight * 0.4);
    } else {
      exploreButtonY.value = withTiming(-1000);
    }
  };

  const startClusterAnchorAnimation = () => {
    if (clusterAnchorY.value === -1200) {
      clusterAnchorY.value = withTiming(windowHeight * 0.4);
    } else {
      clusterAnchorY.value = withTiming(-1200);
    }
  };

  const startHeatPointAnimation = () => {
    if (heatPotintY.value === -1200) {
      heatPotintY.value = withTiming(windowHeight * 0.3);
    } else {
      heatPotintY.value = withTiming(-1200);
    }
  };

  const startArrowAnimation = () => {
    if (arrowY.value === -1200) {
      arrowY.value = withTiming(windowHeight * 0.06);
    } else {
      arrowY.value = withTiming(-1200);
    }
  };

  const startUserBoxAnimation = () => {
    if (userBoxX.value === -300) {
      userBoxX.value = withSpring(windowWidth * 0.2);
    } else {
      userBoxX.value = withTiming(-500);
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
    startPicAnimation();
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
              height: "100%",
              width: "100%",
            }}
          />
        </Animated.View>

        <Animated.View style={[textBoxSlide, styles.textBox]}>
          <Text style={styles.textContain}>{textRead}</Text>
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, exporeButtonSlide]}>
          <MaterialIcons name="explore" color="aquamarine" size={32} />
        </Animated.View>

        <Animated.View style={[styles.userContainer, userBoxSlide]}>
          <UserNamer></UserNamer>
        </Animated.View>

        <Animated.View
          style={[styles.anchorClusterWrapper, clusterAnchorSlide]}
        >
          <Image
            source={anchorClustIOS}
            style={{
              height: 30,
              width: 30,
            }}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor1,
              {
                height: 30,
                width: 30,
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor2,
              {
                height: 30,
                width: 30,
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor3,
              {
                height: 30,
                width: 30,
              },
            ]}
          />

          <Image
            source={anchorIconIOS}
            style={[
              styles.anchor4,
              {
                height: 30,
                width: 30,
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
                height: 50,
                width: 50,
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
                height: 90,
                width: 200,
              },
            ]}
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
    bottom: "7%",
    height: "45%",
    width: "100%",
    opacity: 1,
  },
  textBox: {
    position: "absolute",
    width: "90%",
    height: "15.5%",
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
    width: scale(225),
    height: scale(100),
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
    top: Platform.OS === "ios" ? "11%" : "11%",
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
    borderRadius: 50,
    position: "absolute",
    left: "20%",
    height: 45,
    width: 45,
    opacity: 1,
    backgroundColor: "black",
  },
  anchorClusterWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: "20%",
    height: 50,
    width: 50,
    opacity: 1,
  },
  anchor1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth * 0.13,
    top: -40,
    height: 45,
    width: 45,
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
    top: -40,
    height: 45,
    width: 45,
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
    top: 60,
    height: 45,
    width: 45,
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
    top: 60,
    height: 45,
    width: 45,
    opacity: 1,
    marginBottom: 15,
  },
  heatPointWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: "50%",
    height: 50,
    width: 50,
    opacity: 1,
  },
  arrowWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: "2%",
    height: 110,
    width: 160,
    opacity: 1,
  },
});
