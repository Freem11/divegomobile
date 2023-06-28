import React from "react";
import { useContext } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { scale } from "react-native-size-matters";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import AnimalTag from "./animalTags";
import Animated from "react-native-reanimated";

export default function AnimalTopAutoSuggest(props) {
  const { transTagsY } = props;
  const { animalMultiSelection, setAnimalMultiSelection } = useContext(
    AnimalMultiSelectContext
  );
 
  return (
    <View style={{flex: 1, alignSelf: "center", justifyContent: "center"}}>
        <Animated.View
        style={[transTagsY]} pointerEvents={'box-none'}>
          <View style={styles.tagContainer} pointerEvents={'box-none'}>
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
  container: {
    width: "95%",
    flexDirection: "row",
    overflow: "hidden",
    alignContent: "center",
    alignItems: "center",
  },
  xButton: {
    margin: 2,
  },
  aButton: {
    marginTop: 0,
    marginLeft: -24,
    zIndex: -1,
  },
  suggestInput: {
    width: "84%",
    height: scale(19),
    paddingLeft: 10,
    paddingRight: 25,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 0,
    marginBottom: 2,
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "Caveat_700Bold",
    overflow: "hidden",
  },
  suggestInputRed: {
    width: 200,
    height: 40,
    marginBottom: 20,
    backgroundColor: "pink",
    borderRadius: 10,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "IndieFlower_400Regular",
    overflow: "hidden",
  },
  listcont: {
    display: "flex",
    marginTop: scale(30),
    position: "absolute",
  },
  ImageButton: {
    backgroundColor: "#33586A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: scale(35),
    width: 165,
    marginBottom: 7,
    opacity: 1,
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
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
