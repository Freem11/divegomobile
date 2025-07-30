import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../styles";

const AnimalTag = (props) => {
  const { animalMultiSelection, setAnimalMultiSelection, animalName } = props;

  const handleClearTag = async(text) => {
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
              color: colors.themeBlack,
              fontFamily: activeFonts.Light,
              fontSize: fontSizes.SmallText,
              textAlign: "center",
              marginLeft: 4,
              marginRight: 2
            }}
          >
            {animalName}
          </Text>
          <View style={styles.xButton}>
            <MaterialIcons
              name="highlight-remove"
              size={scale(10)}
              color="darkgrey"
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
    borderRadius: scale(10),
    borderColor: colors.secondaryYellow,
    backgroundColor: colors.themeWhite,
    height: scale(20),
    marginRight: scale(5),
    marginBottom: scale(5),
  },
  animalTag:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    marginLeft: 3,
  },
  xButton:{
    marginTop: scale(4),
    marginRight: scale(3),
    marginBottom: scale(4),
  }
});

export default AnimalTag;
