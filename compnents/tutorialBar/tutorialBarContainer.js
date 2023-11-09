import React from "react";
import { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import { TutorialResetContext } from "../contexts/tutorialResetContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { ChapterContext } from "../contexts/chapterContext";
import { SessionContext } from "../contexts/sessionContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";

export default function TutorialBar() {
  const { tutorialReset, setTutorialReset } = useContext(TutorialResetContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { chapter, setChapter } = useContext(ChapterContext);
  const [tutorialList, setTutorialList] = useState(null);
  const [count, setCount] = useState(0);

  const Tut1List = [
    "Getting around the map",
    "Dive sites",
    "Changed dive site",
    "Exit Guide",
  ];
  const Tut2List = [
    "Checking for a dive site",
    "Adding your dive sites",
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
      console.log({ title: "Error", message: "e.message" });
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
  };

  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      {/* <View style={{ flexDirection: "column" }}> */}
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
        <View
          style={{
            position: "absolute",
            left: scale(-10),
            height: scale(30),
            width: scale(80),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "maroon",
            borderRadius: scale(15),
            paddingRight: 5,
            paddingLeft: 5,
          }}
        >
          <Text
            style={{
              color: "darkgrey",
              fontFamily: "PatrickHand_400Regular",
              fontSize: scale(14),
            }}
          >
            Guide Active
          </Text>
        </View>
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
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
        </View>
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: 'blue',
    marginTop: scale(-10)
  },
  library: {
    zIndex: 60,
    height: "auto",
    width: "210%",
    marginTop: scale(35),
    marginLeft: scale(-10),
    borderRadius: 15,
    backgroundColor: "#538dbd",
    // paddingBottom: scale(5),
  },
  chapter: {
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 2,
    // backgroundColor: "#538dbd",
  },
});
