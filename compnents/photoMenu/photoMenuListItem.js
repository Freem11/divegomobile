import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { scale } from "react-native-size-matters";
import React, { useContext } from "react";
import { DevelopmentModeContext } from "../contexts/developementModeContext";
import ImageCasher from "../helpers/imageCashing";

const PhotoMenuListItem = (props) => {
  const { pic, setAnimalMultiSelection, animalMultiSelection } = props;
  const { developmentMode } = useContext(DevelopmentModeContext);

  const handleSelect = (name) => {
    if (animalMultiSelection.includes(name)) {
      setAnimalMultiSelection(
        animalMultiSelection.filter((item) => item !== name)
      );
    } else {
      setAnimalMultiSelection([...animalMultiSelection, name]);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => handleSelect(pic.label)}
      key={pic.id}
    >
      <View
        style={
          animalMultiSelection.includes(pic.label)
            ? styles.shadowboxSelected
            : styles.shadowbox
        }
        key={pic.id}
      >
        <View style={{ justifyContent: "center", height: 33 }}>
          <Text
            style={
              animalMultiSelection.includes(pic.label)
                ? styles.photolabelSelected
                : styles.photolabel
            }
          >
            {pic.label}
          </Text>
        </View>
        <ImageCasher
          photoFile={pic.photoFile}
          id={pic.id}
          style={{
            height: 70,
            minWidth: 120,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            resizeMode: "cover",
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  photolabel: {
    fontSize: 11,
    color: "white",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 3,
    fontFamily: "Itim_400Regular",
    paddingLeft: 5,
    paddingRight: 5,
  },
  photolabelSelected: {
    fontSize: 11,
    color: "black",
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingTop: 3,
    fontFamily: "Itim_400Regular",
    paddingLeft: 5,
    paddingRight: 5,
  },
  shadowbox: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    backgroundColor: "darkblue",
    height: 105,
  },
  shadowboxSelected: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "darkgrey",
    backgroundColor: "gold",
    height: 105,
  },
});

export default PhotoMenuListItem;
