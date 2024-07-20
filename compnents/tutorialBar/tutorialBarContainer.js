import React from "react";
import { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import { TutorialResetContext } from "../contexts/tutorialResetContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { ChapterContext } from "../contexts/chapterContext";
import { SessionContext } from "../contexts/sessionContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  useDerivedValue,
} from "react-native-reanimated";

export default function TutorialBar() {
  const { tutorialReset, setTutorialReset } = useContext(TutorialResetContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);

  const { chapter, setChapter } = useContext(ChapterContext);
  const [tutorialList, setTutorialList] = useState(null);
  const [count, setCount] = useState(1);

  const Tut1List = [
    "Getting around the map",
    "Dive sites",
    "Changed dive site",
    "Exit Guide",
  ];
  const Tut2List = [
    "Checking for a dive site",
    "Adding your dive sites",
    "Placing the pin",
    "Exit Guide",
  ];
  const Tut3List = [
    "Contributing photos overview",
    "Adding your photo",
    "Name that sea creature!",
    "Dropping the pin",
    "Exit Guide",
  ];

  const getProfile = async () => {
    let sessionUserId = activeSession.user.id;
    // let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
    try {
      const success = await grabProfileById(sessionUserId);
      if (success) {
        let bully = success[0].UserName;
        if (bully == null || bully === "") {
          setProfile(false);
        } else {
          setProfile(success);
        }
      }
    } catch (e) {
      console.log({ title: "Error19", message: "e.message" });
    }
  };

  const handleList = async () => {
    setCount((prev) => prev + 1);

    if (count % 2 !== 0) {
      setTutorialList(null);
    } else {
      if (typeof itterator === "number") {
        setTutorialList(Tut1List);
      }
      if (typeof itterator2 === "number") {
        setTutorialList(Tut2List);
      }
      if (typeof itterator3 === "number") {
        setTutorialList(Tut3List);
      }
    }
  };

  useEffect(() => {
    handleList()
  }, [tutorialRunning]);

  const handleShift = async (listItem) => {
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
      setChapter(listItem);
      setTutorialList(null);
    }
    setTutorialList(null);
  };

  let counter = 0;
  let blinker;
  const [guideState, setGuideState] = useState(false);

  function guideBut() {
    counter++;
    if (counter % 2 == 0) {
      setGuideState(false);
    } else {
      setGuideState(true);
    }
  }
  function cleanUp() {
    clearInterval(blinker);
    setGuideState(false);
  }

  useEffect(() => {
    if (tutorialRunning) {
        blinker = setInterval(guideBut, 1500);
     
    }
    return () => cleanUp();
  }, []);

  const progress = useDerivedValue(() => {
    return  withTiming(guideState === true ? 1 : 0)
  })

  const guideButtonPulse = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0,1],
      [styles.guideButton.backgroundColor, styles.guideButtonAlt.backgroundColor]
    )
    return {
      backgroundColor,
    };
  });

  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      <TouchableWithoutFeedback
        onPress={handleList}
        style={{
          width: 50,
          height: scale(32),
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
         style={[styles.guideButton, guideButtonPulse]}
        >
          <Text
           style={guideState ? styles.guideTextAlt : styles.guideText} 
          >
            Guide Active
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>

        <View style={styles.library}>
          {tutorialList &&
            tutorialList.length > 0 &&
            tutorialList.map((listItem) => {
              return (
                <TouchableWithoutFeedback
                  key={listItem}
                  onPress={() => handleShift(listItem)}
                >
                  <View
                    key={listItem}
                    style={styles.chapter}
                    onPress={() => handleShift(listItem)}
                  >
                    <Text
                      onPress={() => handleShift(listItem)}
                      style={{
                        fontFamily: "PatrickHand_400Regular",
                        fontSize: scale(15),
                        color: "white",
                      }}
                    >
                      {listItem}
                    </Text>
                    <View style={{height: 1, width: "101%", backgroundColor: "white", marginLeft: -2}}></View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: 'blue',
    marginTop: scale(50)
  },
  library: {
    zIndex: 60,
    height: "auto",
    width: "210%",
    marginTop: scale(37),
    marginLeft: scale(-10),
    borderRadius: 15,
    backgroundColor: "#538dbd",
  },
  chapter: {
    justifyContent: "center",
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 2,
    // borderBottomWidth: 1,
    // borderBottomColor: "white"
  },
  guideButton :{
    position: "absolute",
    left: scale(-10),
    height: scale(35),
    width: scale(90),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "maroon",
    borderRadius: scale(15),
    paddingRight: 5,
    paddingLeft: 5,
  },
  guideButtonAlt :{
    position: "absolute",
    left: scale(-10),
    height: scale(30),
    width: scale(80),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C49102",
    borderRadius: scale(15),
    paddingRight: 5,
    paddingLeft: 5,
  },
  guideText:{
    color: "darkgrey",
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(15),
  },
  guideTextAlt:{
    color: "black",
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(15),
  },

});
