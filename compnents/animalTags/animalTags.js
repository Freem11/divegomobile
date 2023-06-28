import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";

const AnimalTag = (props) => {
  const { animalMultiSelection, setAnimalMultiSelection, animalName } = props;

  const handleClearTag = async (text) => {
    if (animalMultiSelection && animalMultiSelection.includes(text)) {
      setAnimalMultiSelection(
        animalMultiSelection.filter((item) => item !== text)
      );
    }
  };

  return (
      <TouchableWithoutFeedback onPress={() => handleClearTag(animalName)}>
        <View style={[styles.tagBody]}>
          <View style={[styles.animalTag]}>
            <Text
              style={{
                color: "#355D71",
                fontFamily: "PermanentMarker_400Regular",
                fontSize: 12,
                marginBottom: 2,
                marginLeft: 4,
                marginRight: 2
              }}
            >
              {animalName}
            </Text>
            <View style={styles.xButton}>
              <MaterialIcons
                name="highlight-remove"
                size={18}
                color="#355D71"
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  tagBody:{
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "gold",
    backgroundColor: "white",
    height: 25,
    marginRight: 5,
    marginBottom: 5,
  },
  animalTag:{
    flexDirection: "row",
    marginTop: 1,
    marginLeft: 3
  },
  xButton:{
    marginTop: 1,
    marginRight: 3,
    marginBottom: 4
  }
});

export default AnimalTag;
