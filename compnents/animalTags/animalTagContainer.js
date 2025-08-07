import React from "react";
import { useContext } from "react";
import {
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { scale } from "react-native-size-matters";
import Animated from "react-native-reanimated";

import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";

import AnimalTag from "./animalTags";

export default function AnimalTagsContainer(props) {
  const { transTagsY } = props;
  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );

  return (
    <View style={{ flex: 1, alignSelf: "center", justifyContent: "center", marginTop: Platform.OS === "ios" ? "0.3%" : "0.3%" }} pointerEvents={"box-none"}>
      <Animated.View
        style={[transTagsY]}
        pointerEvents={"box-none"}
      >
        <View style={styles.tagContainer} pointerEvents={"box-none"}>
          {animalMultiSelection.length > 0 &&
              animalMultiSelection.map((animal) => {
                return (
                  <AnimalTag
                    key={animal}
                    animalMultiSelection={animalMultiSelection}
                    setAnimalMultiSelection={setAnimalMultiSelection}
                    animalName={animal}
                  />
                );
              })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    position: "relative",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: scale(0),
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    alignContent: "center",
    alignItems: "center",
    width: scale(340),
  },
});
