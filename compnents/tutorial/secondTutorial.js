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
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import mantaIOS from "../png/Manta32.png";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { getRecentPhotos } from "../../supabaseCalls/photoSupabaseCalls";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import moment from "moment";
import { scale } from "react-native-size-matters";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import anchorClustIOS from "../png/ClusterAnchor24.png";
import anchorIconIOS from "../png/SiteAnchor20.png";
import heatIconIOS from "../png/heatpoint.png";
import arrowIOS from "../png/arrow.png";
import UserNamer from "./usernamer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SecondTutorial(props) {
  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { tutorialModalY } = props;
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { setMapCenter } = useContext(MapCenterContext);

  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );

  const [pics, setPics] = useState([]);
  const [profile, setProfile] = useState([]);

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
  const DsSearchY = useSharedValue(-1000);
  const diveSiteY = useSharedValue(-1000);

  const clusterAnchorY = useSharedValue(-1200);
  const heatPotintY = useSharedValue(-1200);
  const arrowY = useSharedValue(-1200);
  const userBoxX = useSharedValue(-300);

  const text0 =
    "Hey welcome back! Now that you have a Diver Name, I can show you how you can contribute to SEAsons!";
  const text1 =
    "First, let's look at working with Dive sites, let's move to a spot with known dive sites";
  const text2 =
    "Now that the map is positioned, let's check for a dive site by tapping on the dive site search tool option, it looks like this";
  const text3 = "";
  const text4 =
    "Now that the options are open it will show you a list of dive sites in the area, try searching for 'Copper Cliffs' and select it, once you have found it";
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
    "Next are the GPS lat and lng fields. The easiest way to get them is to be AT the dive site and simply tap the 'I'm at the dive site button' it will take your current location and use them as the coordinates for the dive site!";
  const text12 =
    "If you are at home, and have the name of the site as well as the decimal format GPS coordinates, you can add them manually as well";
  const text13 =
    "Once you have your site name and GPS fields filled out, simply tap the 'Submit Dive Site' button at the bottom and your site will be submited for review";
  const text14 =
    "Please note your new site won't automatically be added to the map, the SEAsons team will verify your submisison before committing to the map, but after that your site will go in and be credited to you with your diver name that we setup earlier!";
  const text15 = "Give it a try for yourself add a name and GPS using the 'I'm at the dive site' button and submit!";
  const text16 = "";
  const text17 = "Nice Job, That's how you add a new dive site to SEAsons! In this case since this is a guide, this entry was not submitted, but you can from now on in the same way.";
  const text18 =
    "That's it for adding dive sites to the app!, in the next guide we will look at adding sea creature sighting photos instead! Tap on this button to go to that guide next, otherwise tap anywhere else to close, and thanks for joining me again!";
  const text19 = "";

  const [textRead, setTextRead] = useState("");

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
    if (itterator2 === 3) {
      return;
    } else {
    if (pushVal === 1 && itterator2 < feederArray.length - 1) {
      setItterator2((prev) => prev + pushVal);
    }

    if (pushVal === 1 && itterator2 === feederArray.length - 1) {
      setSecondGuideModal(!secondGuideModal);
    }
    }

    // setTextRead("");
    // clearInterval(interval);
    // let textArray = textVal.split("");

    //   interval = setInterval(() => {

    //     setTextRead((prev) => prev + textArray[0]);
    //     textArray = textArray.slice(1);

    //     if(pushVal === 1){
    //       clearInterval(interval);
    //       setTextRead(textVal);
    //     }

    //     if (!textArray.length) {
    //       clearInterval(interval);
    //     }

    //   }, 50);
  };

  useEffect(() => {
    let textVal = feederArray[itterator2];
    setTextRead(textVal);

    console.log(itterator2, feederArray.length);

    if (itterator2 === 0) {
      setTimeout(() => {
        startCharacterAnimation();
      }, 1700);

      setTimeout(() => {
        startTextBoxAnimation();
        setupText(0);
      }, 1900);
    }

    if (itterator2 === 2) {
      moveMap({ lat: 50.03312260000001, lng: -125.2733354 });
      setTimeout(() => {
        startDsSearchButtonAnimation();
      }, 1000);
    }

    if (itterator2 === 3) {
      startDsSearchButtonAnimation();
      setSecondGuideModal(!secondGuideModal);
    }

    if (itterator2 === 4) {
      setSecondGuideModal(!secondGuideModal);
    }

    if (itterator2 === 5) {
      setSecondGuideModal(!secondGuideModal);
    }

    if (itterator2 === 6) {
      setSecondGuideModal(!secondGuideModal);
    }

    if (itterator2 === 8) {
      startDiveSiteAnimation();
    }

    if (itterator2 === 9) {
      startDiveSiteAnimation();
      setSecondGuideModal(!secondGuideModal);
    }

    if (itterator2 === 16) {
      setSecondGuideModal(!secondGuideModal);
    }

    if (itterator2 === 19) {
      setAddSiteVals({
        Site: "",
        Latitude: "",
        Longitude: "",
        UserID: null,
      });
       setDiveSiteAdderModal(!diveSiteAdderModal);
       setTutorialRunning(false);
    }

    if (itterator2 === feederArray.length - 1) {
      setTutorialRunning(false);
      setItterator2(null);
      setSecondGuideModal(!secondGuideModal);
      startCharacterAnimation();
      startTextBoxAnimation();
      console.log("what", tutorialRunning)
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

  const startDsSearchButtonAnimation = () => {
    if (DsSearchY.value === -1000) {
      DsSearchY.value = withTiming(windowHeight * 0.4);
    } else {
      DsSearchY.value = withTiming(-1000);
    }
  };

  const startDiveSiteAnimation = () => {
    if (diveSiteY.value === -1000) {
      diveSiteY.value = withTiming(windowHeight * 0.4);
    } else {
      diveSiteY.value = withTiming(-1000);
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
    if(tutorialRunning){
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
            source={mantaIOS}
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
            size={32}
          />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, diveSiteSlide]}>
          <MaterialIcons name="add-location-alt" color="aquamarine" size={32} />
        </Animated.View>

        {/* new one  */}
        <Animated.View style={[styles.userContainer, userBoxSlide]}>
          <UserNamer></UserNamer>
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
    height: "51%",
    width: "60%",
    opacity: 1,
  },
  textBox: {
    position: "absolute",
    width: "90%",
    height: "10%",
    backgroundColor: "white",
    borderRadius: 15,
    alignSelf: "center",
    opacity: 1,
  },
  textContain: {
    padding: 10,
    fontFamily: "SanFran",
    fontSize: scale(10),
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
