import React from "react";
import { useContext } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import { TutorialResetContext } from "../contexts/tutorialResetContext";

export default function TutorialBar() {
  const { tutorialReset, setTutorialReset } = useContext(TutorialResetContext);

  const handleClearTutorial = async () => {
    setTutorialReset(true);
  };
  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      <TouchableWithoutFeedback
        onPress={() => console.log("menu tapped")}
        style={{
          width: 28,
          height: 32,
        }}
      >
        <View
          style={{
            backgroundColor: "lightgrey",
            borderRadius: 10,
            padding: 2,
          }}
        >
          <MaterialIcons name="menu" size={26} color="white" />
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={handleClearTutorial}
        style={{
          width: 50,
          height: 32,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            right: 0,
            height: 30,
            width: "25%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "maroon",
            borderRadius: 15,
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
    width: "95%",
    flexDirection: "row",
  },
});
