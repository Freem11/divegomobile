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
} from "react-native-reanimated";
import mantaIOS from "../png/Manta32.png";
import seaLionGuy from "../png/EmilioNeutral.png";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { UserProfileContext } from "../contexts/userProfileContext";
import { scale } from "react-native-size-matters";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { PictureContext } from "../contexts/pictureContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { TutorialResetContext } from "../contexts/tutorialResetContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { PinContext } from "../contexts/staticPinContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import { ChapterContext } from "../contexts/chapterContext";
import { MasterContext } from "../contexts/masterContext";

import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ThirdTutorial() {
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { pinValues, setPinValues } = useContext(PinContext);
  const { uploadedFile, setUploadedFile } = useContext(PictureContext);
  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
  const { tutorialReset, setTutorialReset } = useContext(TutorialResetContext);
  const { setMapCenter } = useContext(MapCenterContext);
  const { setMasterSwitch } = useContext(MasterContext);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (tutorialReset) {
      setItterator3(null);
      setPicAdderModal(false);
      setTutorialRunning(false);
      setThirdGuideModal(false);
      setMasterSwitch(true);
      setUploadedFile(null);
      setPinValues({
        ...pinValues,
        PicFile: null,
        Animal: "",
        PicDate: "",
        Latitude: "",
        Longitude: "",
        DDVal: "0",
      });
      resetTutorial();
      setChapter(null);
    }
  }, [tutorialReset]);

  useEffect(() => {
    setMasterSwitch(true);
    resetTutorial();

    switch (chapter) {
      case "Contributing photos overview":
        setItterator3(3);
        setPicAdderModal(false);
        setThirdGuideModal(true);
        characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
        textBoxY.value = withTiming(windowHeight * 0.80);
        setUploadedFile(null);
        setPinValues({
          ...pinValues,
          PicFile: null,
          Animal: "",
          PicDate: "",
          Latitude: "",
          Longitude: "",
          DDVal: "0",
        });
        break;

      case "Adding your photo":
        setItterator3(6);
        setThirdGuideModal(true);
        characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
        textBoxY.value = withTiming(windowHeight * 0.80);
        setPicAdderModal(true);
        break;

      case "Name that sea creature!":
        setItterator3(12);
        setThirdGuideModal(true);
        characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
        textBoxY.value = withTiming(windowHeight * 0.80);
        setPicAdderModal(true);
        break;

      case "Dropping the pin":
        setItterator3(15);
        setThirdGuideModal(true);
        characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
        textBoxY.value = withTiming(windowHeight * 0.80);
        setPicAdderModal(true);
        break;
    }
  }, [chapter]);

  const resetTutorial = async () => {
    characterX.value = 1000;
    textBoxY.value = 1000;
    photoY.value = scale(-1000);
    imageY.value = scale(-1000);
    pinY.value = scale(-1000);
    mantaY.value = scale(-1200);
    setTutorialReset(false);
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

  const characterX = useSharedValue(1000);
  const textBoxY = useSharedValue(1000);
  const photoY = useSharedValue(scale(-1000));
  const imageY = useSharedValue(scale(-1000));
  const calendarY = useSharedValue(scale(-1000));
  const pinY = useSharedValue(scale(-1000));
  const mantaY = useSharedValue(scale(-1200));

  const text0 =
    "Hey welcome back again! Let's continue with the guide on how you can contribute to DiveGo!";
  const text1 =
    "This time, let's look at working with your sea creature sightings, in other words the photos of sea creatures you have taken on your dives ";
  const text2 =
    "At this point you have already seen that diver's photos make up the heat map and show up when you open a dive site that is near to a sighting";
  const text3 =
    "Now it's time for you to join your fellow divers! To add a photo, we first need to open up the photo adding form, under the photo icon. It looks like this";
  const text4 = "Open it up and let's take a look!";
  const text5 = "";
  const text6 =
    "This is the photo adding form, as you can see there's a lot here, so let's start from the top and work our way down.";
  const text7 =
    "At the top you can see this big empty field and just below is the 'Choose an image' button, tap it to go into your device's photos and select one (preferably a sea creature of course!)";
  const text8 = "";
  const text9 =
    "As you can see, the photo you chose is now in the big empty field and, depending on the photo you may have seen, that the date, lat. and lng. fields are populated. DiveGo will pull that data off your photo if it carries that info. If not, don't worry we can add them manually.";
  const text10 =
    "In any case, let's assume you need to add in that info. First let's take care of the date, you'll see a calendar icon just to the right of the date field (looks like this) tap in and set the date the photo was taken for us";
  const text11 = "";
  const text12 =
    "Great! Now that we have the correct date in place, let's move down to the next 'animal' field. For this one, you can tap right on it and a dropdown will pop up.";
  const text13 =
    "Start entering the name of the sea creature in your picture, if it already exists in DiveGo it will show up as a selectable option to help speed things along, but if it's completely new you will need to type it out.";
  const text14 = "";
  const text15 =
    "Wonderful! Now that the sea creature has its name, the only piece left is the GPS, since we are assuming that we don't have them, use the Pin Dropper button to open up the map so we can drop a pin!";
  const text16 = "";
  const text17 =
    "And here we are! As you can see there is a new icon that looks like a manta ray, this is our draggable pin. It's also why we add dive sites (to give you points to drag the pin too)";
  const text18 =
    "Let's pretend that one of the dive sites on the map is where your sea creature sighting took place, drag the manta pin to be on top of it's anchor and then tap the 'set pin' button at the bottom";
  const text19 = "";
  const text20 =
    "As you can see DiveGo has taken the location of the pin you set and has given us its GPS coordinates!";
  const text21 =
    "Your sighting is now ready! All you need to do now is tap the 'submit photo' button at the bottom to finish up!";
  const text22 = "";
  const text23 =
    "Bam! That's how you add a new sea creature sighting to DiveGo! As we did with the dive site guide, this entry was not submitted since it's a dry run, but you can from now on in the same way.";
  const text24 =
    "Just like with the Dive site submissions your sea creature sighting won't automatically be added to the map, the DiveGo team will verify your submission before committing to the map, but after that your photo will go in and be credited to you with your diver name that we setup back in the intro guide!";
  const text25 =
    "That's it for adding sea creature sightings to the app! This is currently the last guide so tap anywhere else to close, and thanks for being a member of DiveGo, I look forward to seeing what amazing sea creatures you encounter on your dives!";
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
      itterator3 === 5 ||
      itterator3 === 8 ||
      itterator3 === 11 ||
      itterator3 === 14 ||
      itterator3 === 16 ||
      itterator3 === 19 ||
      itterator3 === 22 ||
      itterator3 >= 26
    ) {
      return;
    } else {
      if (pushVal === 1 && itterator3 < feederArray.length - 1) {
        if (textPrinting) {
          setTextPrinting(false);
          textArray = "";
          setTextRead("");
          setTextRead(feederArray[itterator3]);
        } else {
          setItterator3((prev) => prev + pushVal);
          setTextPrinting(true);
        }
      }

      if (pushVal === 1 && itterator3 === feederArray.length - 1) {
        setThirdGuideModal(false);
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

    let textVal = feederArray[itterator3];
    if (textVal) {
      textArray = textVal.split("");
      if (textPrinting) {
        textPrinter = setInterval(printOutText, 40);
      } else {
        setTextRead(textVal);
      }
    }

    return () => cleanUp();
  }, [itterator3, textPrinting]);

  useEffect(() => {
    // let textVal = feederArray[itterator3];
    // setTextRead(textVal);

    if (itterator3 === 0) {
      setTimeout(() => {
        startCharacterAnimation();
      }, 400);

      setTimeout(() => {
        startTextBoxAnimation();
        setupText(0);
      }, 600);
    }

    if (itterator3 === 3) {
      photoY.value = withTiming(windowHeight * 0.4);
      // startPhotoButtonAnimation();
    }

    if (itterator3 === 5) {
      setChapter(null);
      setTimeout(() => {
        characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
      }, 400);

      setTimeout(() => {
        textBoxY.value = withTiming(windowHeight * 0.80);
        setupText(0);
      }, 600);
      photoY.value = withTiming(scale(-1000));
      // startPhotoButtonAnimation();
      setThirdGuideModal(false);
    }

    if (itterator3 === 7) {
      imageY.value = withTiming(windowHeight * 0.4);
      // startImageButtonAnimation();
    }

    if (itterator3 === 8) {
      imageY.value = withTiming(scale(-1000));
      // startImageButtonAnimation();
      setThirdGuideModal(false);
    }

    if (itterator3 === 10) {
      calendarY.value = withTiming(windowHeight * 0.4);
      //  startCalendarAnimation();
    }

    if (itterator3 === 11) {
      calendarY.value = withTiming(scale(-1000));
      // startCalendarAnimation();
      setThirdGuideModal(false);
    }

    if (itterator3 === 12) {
      setThirdGuideModal(true);
    }
    if (itterator3 === 13) {
      setChapter(null);
      setTimeout(() => {
        characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
      }, 400);

      setTimeout(() => {
        textBoxY.value = withTiming(windowHeight * 0.80);
        setupText(0);
      }, 600);
    }

    if (itterator3 === 14) {
      setThirdGuideModal(false);
    }

    if (itterator3 === 15) {
      setThirdGuideModal(true);
      setTimeout(() => {
        pinY.value = withTiming(windowHeight * 0.4);
        // startPinAnimation();
      }, 1000);
    }

    if (itterator3 === 16) {
      setChapter(null);
      setTimeout(() => {
        characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
      }, 400);

      setTimeout(() => {
        textBoxY.value = withTiming(windowHeight * 0.80);
        setupText(0);
      }, 600);
      setThirdGuideModal(false);
      pinY.value = withTiming(scale(-1000));
      // startPinAnimation();
    }

    if (itterator3 === 17) {
      setPicAdderModal(false);
      setThirdGuideModal(true);
      setTimeout(() => {
        mantaY.value = withTiming(windowHeight * 0.4);
        // startMantaAnimation();
      }, 1000);
    }

    if (itterator3 === 19) {
      setThirdGuideModal(false);
      mantaY.value = withTiming(scale(-1200));
      // startMantaAnimation();
    }

    if (itterator3 === 20) {
      setThirdGuideModal(true);
    }

    if (itterator3 === 22) {
      setThirdGuideModal(false);
    }

    if (itterator3 === 23) {
      setThirdGuideModal(true);
    }

    if (itterator3 === 26) {
      setPinValues({
        ...pinValues,
        PicFile: null,
        Animal: "",
        PicDate: "",
        Latitude: "",
        Longitude: "",
        DDVal: "0",
      });
      setUploadedFile(null);
      setPicAdderModal(false);
      setTutorialRunning(false);
    }

    if (itterator3 === feederArray.length - 1) {
      setTutorialRunning(false);
      setItterator3(null);
      setThirdGuideModal(false);
      startCharacterAnimation();
      startTextBoxAnimation();
      setChapter(null);
    }
  }, [itterator3]);

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

  const photoButtonSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: photoY.value }],
    };
  });

  const imageButtonSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: imageY.value }],
    };
  });

  const calendarSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: calendarY.value }],
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

  const startCharacterAnimation = () => {
    if (characterX.value === 1000) {
      characterX.value = withTiming(Platform.OS === "ios" ? windowWidth* 0.20 : windowWidth* 0.26);
    } else {
      characterX.value = withTiming(1000);
    }
  };

  const startTextBoxAnimation = () => {
    if (textBoxY.value === 1000) {
      textBoxY.value = withTiming(windowHeight * 0.80);
    } else {
      textBoxY.value = withTiming(1000);
    }
  };

  const startPhotoButtonAnimation = () => {
    if (photoY.value === scale(-1000)) {
      photoY.value = withTiming(windowHeight * 0.4);
    } else {
      photoY.value = withTiming(scale(-1000));
    }
  };

  const startImageButtonAnimation = () => {
    if (imageY.value === scale(-1000)) {
      imageY.value = withTiming(windowHeight * 0.4);
    } else {
      imageY.value = withTiming(scale(-1000));
    }
  };

  const startCalendarAnimation = () => {
    if (calendarY.value === scale(-1000)) {
      calendarY.value = withTiming(windowHeight * 0.4);
    } else {
      calendarY.value = withTiming(scale(-1000));
    }
  };

  const startPinAnimation = () => {
    if (pinY.value === scale(-1000)) {
      pinY.value = withTiming(windowHeight * 0.4);
    } else {
      pinY.value = withTiming(scale(-1000));
    }
  };

  const startMantaAnimation = () => {
    if (mantaY.value === scale(-1200)) {
      mantaY.value = withTiming(windowHeight * 0.4);
    } else {
      mantaY.value = withTiming(scale(-1200));
    }
  };

  useEffect(() => {
    if (tutorialRunning) {
      if (itterator3 === null) {
        setItterator3(0);
      }
    }
  }, [thirdGuideModal]);

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
              height: windowWidth > 600 ? 800 : 500,
              width: windowWidth > 600 ? 840 : 520,
            }}
          />
        </Animated.View>

        <Animated.View style={[textBoxSlide, styles.textBox]}>
          <Text style={styles.textContain}>{textRead}</Text>
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, photoButtonSlide]}>
          <MaterialIcons
            name="photo-camera"
            color="aquamarine"
            size={scale(42)}
          />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, imageButtonSlide]}>
          <FontAwesome name="picture-o" color="gold" size={scale(34)} />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, calendarSlide]}>
          <FontAwesome
            name="calendar"
            color="gold"
            size={scale(34)}
            style={{ marginBottom: 2.5 }}
          />
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
        ? scale(-220)
        : Platform.OS === "ios"
        ? windowHeight * -0.5
        : scale(-330),
    left:
      windowWidth > 600
        ? scale(100)
        : Platform.OS === "ios"
        ? scale(0)
        : scale(-20),
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
});
