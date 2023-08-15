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
import { TutorialModelContext } from "../contexts/tutorialModalContext";
import { getRecentPhotos } from "../../supabaseCalls/photoSupabaseCalls";
import moment from "moment";
import { scale } from "react-native-size-matters";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { TutorialContext } from "../contexts/tutorialContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import anchorClustIOS from "../png/ClusterAnchor24.png";
import anchorIconIOS from "../png/SiteAnchor20.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TutorialBase(props) {
const { tutorialModalY } = props

  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { setMapCenter } = useContext(MapCenterContext);

  const [pics, setPics] = useState([]);

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
  // const anchor1Y = useSharedValue(-1000);
  // const anchor2Y = useSharedValue(-1000);
  // const anchor3 = useSharedValue(-1000);

  const text0 = "Hi, welcome to SEAsons, I'm XXX, I'm here to show you around.";
  const text1 =
    "First let's find a spot with some action. Here are 3 of the most recent sightings by other divers.";
  const text2 = "Choose one and let's see what else is there!";
  const text3 =
    "Great! We've moved the map, as you can see there is a lot more action here!";
  const text4 =
    "Normally to move the Map, you can use the location search under this icon. Enter in the name of the location you want to hop over to and it will take you there.";
  const text5 =
    "Looking at the map you can now see a few things, namely these grey and blue anchors, the grey anchors are a cluster of dive sites, the blue anchors are dive sites try tapping on one and lets take a closer look!";
  const text6 = ""
  const text7 =
    "Wow, cool! look at all the neat sea creatures divers have already seen here by other divers!";
  const text8 =
    "Now try closing the dive site and chose a creature or two from the pictures along the top, then come back to the dive site and see what's changed!";
  const text9 = ""


  const [textRead, setTextRead] = useState("");
 
  const feederArray = [text0, text1, text2, text3, text4, text5, text6, text7, text8, text9];

  //  var interval;

  const setupText = (pushVal) => {
    if (itterator === 2) {
      return;
    } else {
      if (pushVal === 1 && itterator < feederArray.length - 1) {
        setItterator((prev) => prev + pushVal);
      }

      if (pushVal === 1 && itterator === feederArray.length - 1) {
        setGuideModal(!guideModal);
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
    let textVal = feederArray[itterator];
    setTextRead(textVal);

    console.log(itterator, feederArray.length);

    if (itterator === 0){
      setTutorialRunning(true)
      setTimeout(() => {
        startCharacterAnimation();
      }, 1700);
  
      setTimeout(() => {
        startTextBoxAnimation();
        setupText(0);
      }, 1900);
    }

    if (itterator === 1) {
      startPicAnimation();
    }

    if (itterator === 4 || itterator === 5) {
      startExploreButtonAnimation();
    }

    if (itterator === 5 || itterator === 6) {
      startClusterAnchorAnimation();
    }

    if (itterator === 6) {
      startCharacterAnimation()
      startTextBoxAnimation()
      setGuideModal(!guideModal);
    }

    if (itterator === 7) {
      startCharacterAnimation()
      startTextBoxAnimation()
    }

    if(itterator === feederArray.length -1){
      setItterator(null)
      setTutorialRunning(false)
      setGuideModal(!guideModal);
      startCharacterAnimation()
      startTextBoxAnimation()
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

  useEffect(() => {

   
    if (itterator === null){
      setItterator(0)
    }
    
    let today = new Date();
    let formattedDate = moment(today).format("YYYY-MM-DD");
    getPhotos(formattedDate);

    // if(itterator === 0){
    //   setTimeout(() => {
    //     startCharacterAnimation();
    //   }, 200);
  
    //   setTimeout(() => {
    //     startTextBoxAnimation();
    //     setupText(0);
    //   }, 400);
    // }

   
  }, []);

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
          colors={["transparent", "black"]}
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

        {
          /* <View style={styles.container3}>
           {pics &&
            pics.map((pic) => {
              return(
                <Text>HI</Text>
              // <View key={pic.id} style={styles.picContainer3}>
                /* <View style={styles.micro}>
                  <Text style={styles.titleText}>{pic.label}</Text>
                </View> */
          /* <View style={styles.shadowbox}>
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
                </View> */
          // </View>
          //     )
          //   })}
          // )}
          /* </View> */
        }

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

        <Animated.View style={[styles.buttonwrapper, exporeButtonSlide]}>
          <MaterialIcons name="explore" color="aquamarine" size={32} />
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
            style={[styles.anchor1,{
              height: 30,
              width: 30,
            }]}
          />

          <Image
            source={anchorIconIOS}
            style={[styles.anchor2,{
              height: 30,
              width: 30,
            }]}
          />

          <Image
            source={anchorIconIOS}
            style={[styles.anchor3,{
              height: 30,
              width: 30,
            }]}
          />

          <Image
            source={anchorIconIOS}
            style={[styles.anchor4,{
              height: 30,
              width: 30,
            }]}
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
    left: windowWidth* 0.13,
    top: -40,
    height: 45,
    width: 45,
    opacity: 1,
    marginBottom: 15
  },
  anchor2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth* -0.09,
    top: -40,
    height: 45,
    width: 45,
    opacity: 1,
    marginBottom: 15
  },
  anchor3: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth* -0.09,
    top: 60,
    height: 45,
    width: 45,
    opacity: 1,
    marginBottom: 15
  },
  anchor4: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    position: "absolute",
    left: windowWidth* 0.13,
    top: 60,
    height: 45,
    width: 45,
    opacity: 1,
    marginBottom: 15
  },
});
