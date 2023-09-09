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

export default function TutorialBar() {
  const { tutorialReset, setTutorialReset } = useContext(TutorialResetContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);

  const { chapter, setChapter } = useContext(ChapterContext);
  const [tutorialList, setTutorialList] = useState(null);
  const [count, setCount] = useState(0);

  const Tut1List = [
    "Getting around the map",
    "Dive sites",
    "Changed dive site",
  ];
  const Tut2List = ["Checking for a dive site", "Adding your dive sites"];
  const Tut3List = [
    "Contributing photos overview",
    "Adding your photo",
    "Name that sea creature!",
    "Dropping the pin",
  ];

  const handleClearTutorial = async () => {
    setTutorialReset(true);
  };

  const handleList = async () => {
    setCount((prev) => prev + 1);

    if (count % 2 !== 0) {
      setTutorialList(null);
    } else {
      if (itterator !== null) {
        setTutorialList(Tut1List);
      }
      if (itterator2 !== null) {
        setTutorialList(Tut2List);
      }
      if (itterator3 !== null) {
        setTutorialList(Tut3List);
      }
    }
  };

  const handleShift = async (listItem) => {
    setChapter(listItem);
    setTutorialList(null)
  };

  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      <View style={{ flexDirection: "column" }}>
        <TouchableWithoutFeedback
          onPress={handleList}
          style={{
            width: scale(28),
            height: scale(32),
          }}
        >
          <View
            style={{
              backgroundColor: "lightgrey",
              borderRadius: 10,
              padding: scale(2),
              width: scale(30),
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "5%"
            }}
          >
            <MaterialIcons name="menu" size={scale(26)} color="white" />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.library}>
          {tutorialList &&
            tutorialList.length > 0 &&
            tutorialList.map((listItem) => {
              return (
                <TouchableWithoutFeedback key={listItem} onPress={() => handleShift(listItem)}>
                <View key={listItem} style={styles.chapter} onPress={() => handleShift(listItem)}>
                  <Text
                  onPress={() =>  handleShift(listItem)}
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
      </View>

      <TouchableWithoutFeedback
        onPress={handleClearTutorial}
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
            left: scale(50),
            height: scale(30),
            width: "100%",
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: 'blue'
  },
  library: {
    zIndex: 60,
    height: "auto",
    width: "210%",
    borderRadius: 15,
    backgroundColor: "#538dbd",
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
