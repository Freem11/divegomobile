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
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { SessionContext } from "../contexts/sessionContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { scale } from "react-native-size-matters";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { PinContext } from "../contexts/staticPinContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import {
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ThirdTutorial() {
  const { activeSession } = useContext(SessionContext);
  const { setPinValues } = useContext(PinContext);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { setMapCenter } = useContext(MapCenterContext);

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

  const characterX = useSharedValue(1000);
  const textBoxY = useSharedValue(1000);
  const photoY = useSharedValue(-1000);
  const imageY = useSharedValue(-1000);
  const calendarY = useSharedValue(-1000);
  const pinY = useSharedValue(-1000);
  const mantaY = useSharedValue(-1200);
  
  const text0 =
    "Hey welcome back again! Let's continue with the guide to how you can contribute to SEAsons!";
  const text1 =
    "This time, let's look at working with your sea creature sightings, in other word the photos of sea creatures you have taken on your dives ";
  const text2 =
    "At this point you have already seen that diver's photos make up the heat map and show up when you open a dive site that is near to a sighting";
  const text3 =
    "Now it's time for you to join your fellow divers! To add a photo, we first need to open up the photo adding form, it's under the photo icon it looks like this";
  const text4 = "Open it up and let's take a look!";
  const text5 = "";
  const text6 =
    "This is the photo adding form, as you can see there's a lot here, so let's start from the top and work our way down.";
  const text7 =
    "At the top you can see this big empty field and just below is the 'Choose an image' button, tap it to go into your device's photo's and select one (preferably a sea creature of course!)";
  const text8 = "";
  const text9 =
    "As you can see, the photo you chose is now in the big empty field and, depending on the photo you may have seen that the date, lat and lng fields populated. SEAsons will pull that data off your photo if it carries that info. If not, don't worry we can add them manually.";
  const text10 =
    "In any case, let's assume you need to add in that info. First let's take care of the date, you'll see a calendar icon just to the right of the date field (looks like this) tap in and set the date the photo was taken for us";
  const text11 = "";
  const text12 =
    "Great! Now that we have the correct date in place, let's move down to the next 'animal' field. For this one you can tap right on it and a dropdown will pop up, start entering the name of the sea creature in your picture, if it already exists in SEAsons it will show up and an option to help speed things along, if it's completely new you will need to type it out.";
  const text13 = "";
  const text14 =
    "Wonderful! Now that the sea creature has it's name, the only piece left is the GPS, since we are assuming that we don't have them use the Pin Dropper button to open up the map so we can drop a pin!";
  const text15 = "";
  const text16 =
    "And here we are! As you can see there is a new icon that looks like roughly like a manta ray, this is our draggable pin. It's also why we add dive sites (to give you points to drag the pin too)";
  const text17 =
    "Let's pretend that one of the dive sites on the map is where your sea creature sighting took place, drag the manta pin to be on top of it's anchor and then tap the 'set pin' button at the bottom";
  const text18 = "";
  const text19 =
    "As you can see SEAsons has taken the location of the pin you set and has given us it's GPS coordiantes!";
  const text20 =
    "You sighting is now ready! All you need to do now is tap the 'submit photo' button at the bottom to finish up!";
  const text21 = "";
  const text22 =
    "Bam! That's how you add a new sea creature sighting to SEAsons! As we did with the dive site guide, this entry was not submitted since it's a dry run, but you can from now on in the same way.";
  const text23 =
    "That's it for adding sea creature sightings to the app! This is currnelty the last guide so tap anywhere else to close, and thanks for being a member of SEAsons, I look forward to seeing what amazing sea creatures you encounter on your dives!";
  const text24 = "";

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
    text20,
    text21,
    text22,
    text23,
    text24,
  ];

  //  var interval;

  const setupText = (pushVal) => {
    if (itterator3 === 5 || itterator3 === 8 || itterator3 === 11 || itterator3 === 13 || itterator3 === 15 || itterator3 === 18 || itterator3 === 21 || itterator3 >= 24){
      return;
    } else {
    if (pushVal === 1 && itterator3 < feederArray.length - 1) {
      setItterator3((prev) => prev + pushVal);
      }

      if (pushVal === 1 && itterator3 === feederArray.length - 1) {
        setThirdGuideModal(false);
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
    let textVal = feederArray[itterator3];
    setTextRead(textVal);

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
      startPhotoButtonAnimation();
    }

    if (itterator3 === 5) {
      startPhotoButtonAnimation();
      setThirdGuideModal(!thirdGuideModal);
    }

    if (itterator3 === 7) {
      startImageButtonAnimation();
    }

    if (itterator3 === 8) {
      startImageButtonAnimation();
      setThirdGuideModal(!thirdGuideModal);
    }

    if (itterator3 === 10) {
      startCalendarAnimation();
    }

    if (itterator3 === 11) {
      startCalendarAnimation();
      setThirdGuideModal(!thirdGuideModal);
    }

    if (itterator3 === 12 || itterator3 === 13 || itterator3 === 16 || itterator3 === 18 || itterator3 === 19 || itterator3 === 21 || itterator3 === 22) {
      setThirdGuideModal(!thirdGuideModal);
    }

    if (itterator3 === 14) {
      setThirdGuideModal(!thirdGuideModal);
      setTimeout(() => {
        startPinAnimation();
      }, 1000);
    }

    if (itterator3 === 15) {
      setThirdGuideModal(!thirdGuideModal);
      startPinAnimation();
    }

    if (itterator3 === 16) {
      setTimeout(() => {
        startMantaAnimation();
      }, 1000);
      
    }

    if (itterator3 === 18) {
        startMantaAnimation();
    }

    if (itterator3 === 24) {
      setPinValues({
        PicFile: null,
        Animal: "",
        PicDate: "",
        Latitude: "",
        Longitude: "",
        DDVal: "0",
        UserId: null,
      });
       setPicAdderModal(!picAdderModal);
       setTutorialRunning(false);
    }

    if (itterator3 === feederArray.length - 1) {
      setTutorialRunning(false);
      setItterator3(null);
      setThirdGuideModal(false);
      startCharacterAnimation();
      startTextBoxAnimation();
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

  const startPhotoButtonAnimation = () => {
    if (photoY.value === -1000) {
      photoY.value = withTiming(windowHeight * 0.4);
    } else {
      photoY.value = withTiming(-1000);
    }
  };

  const startImageButtonAnimation = () => {
    if (imageY.value === -1000) {
      imageY.value = withTiming(windowHeight * 0.4);
    } else {
      imageY.value = withTiming(-1000);
    }
  };

  const startCalendarAnimation = () => {
    if (calendarY.value === -1000) {
      calendarY.value = withTiming(windowHeight * 0.4);
    } else {
      calendarY.value = withTiming(-1000);
    }
  };

  const startPinAnimation = () => {
    if (pinY.value === -1000) {
      pinY.value = withTiming(windowHeight * 0.4);
    } else {
      pinY.value = withTiming(-1000);
    }
  };

  const startMantaAnimation = () => {
    if (mantaY.value === -1200) {
      mantaY.value = withTiming(windowHeight * 0.4);
    } else {
      mantaY.value = withTiming(-1200);
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

        <Animated.View style={[styles.buttonwrapper, photoButtonSlide]}>
          <MaterialIcons name="photo-camera" color="aquamarine" size={32} />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, imageButtonSlide]}>
          <FontAwesome name="picture-o" color="gold" size={32} />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, calendarSlide]}>
          <FontAwesome name="calendar" color="gold" size={32} />
        </Animated.View>

        <Animated.View style={[styles.buttonwrapper, pinSlide]}>
          <MaterialIcons name="location-pin" color="gold" size={32} />
        </Animated.View>

        <Animated.View style={[styles.mantaWrapper, mantaSlide]}>
          <Image
            source={mantaIOS}
            style={[
              styles.mantaWrapper,
              {
                height: 60,
                width: 50,
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
