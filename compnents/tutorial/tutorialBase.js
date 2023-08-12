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
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import mantaIOS from "../png/Manta32.png";
import { TutorialModelContext } from "../contexts/tutorialModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TutorialBase() {
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const characterX = useSharedValue(1000);
  const textBoxY = useSharedValue(1000);

  const text0 = "Hi, welcome to SEAsons, I'm XXX, I'm here to show you around.";
  const text1 =
    "First let's find a spot with some action. Here are 3 of the most recent sightings by other divers.";
  const text2 = "Choose one and let's see what else is there!";

  const [textRead, setTextRead] = useState("");
  const [itterator, setItterator] = useState(0);
  const feederArray = [text0, text1, text2]

  var interval;

  const setupText = (pushVal) => {

    console.log("pishval", pushVal)
   
    if(pushVal === 1 && itterator < feederArray.length - 1) {
      setItterator((prev) => prev + pushVal) 
    }

    if (pushVal === 1 && itterator === feederArray.length - 1){
      setGuideModal(!guideModal)
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
    let textVal = feederArray[itterator]
    setTextRead(textVal)
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

  useEffect(() => {
    setTimeout(() => {
      startCharacterAnimation();
    }, 200);

    setTimeout(() => {
      startTextBoxAnimation();
      setupText(0);
    }, 400);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => setupText(1)}>
      <View style={styles.wrapper}>
        <LinearGradient
          style={styles.container}
          colors={["transparent", "black"]}
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
});
