import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { getAnimalNamesThatFit } from "../../supabaseCalls/photoSupabaseCalls";
import AutoSuggestListItem from "./autoSuggestListItem";
import InputField from "../reusables/textInputs";
import { MaterialIcons } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
import { TutorialContext } from "../contexts/tutorialContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { PictureAdderContext } from "../contexts/picModalContext";
import { TouchableOpacity } from "react-native-gesture-handler";

let waiter;

const windowHeight = Dimensions.get("window").height;

offset = 0
if(windowHeight < 700){
  offset = 700
} else {
  offset = 1000
}
const AnimalKeboardOffset = Platform.OS === "ios" ? offset - scale(160) : offset;

export default function AnimalAutoSuggest(props) {
  const { setPin, pin, formValidation, SetFormValidation } = props;
  const [list, setList] = useState([]);
  const [textSource, setTextSource] = useState(false);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning } = useContext(TutorialContext);
  const { picAdderModal } = useContext(PictureAdderContext);

  useEffect(() => {
    clearTimeout(waiter);

    if (tutorialRunning) {
      if (itterator3 === 16) {
        waiter = setTimeout(() => {
          setItterator3(itterator3 + 1);
        }, 2000);
      }
    }
  }, [pin.Animal]);

  useEffect(() => {
    if (!picAdderModal) {
      setTextSource(false);
    }
  }, [picAdderModal]);

  // useEffect(() => {
  //     setTextSource(false)
  //  }, [pin])

  const handleList = async (values) => {
    if (values.value === 1) {
      setPin({ ...pin, Animal: values.animal });
      SetFormValidation({ ...formValidation, AnimalVal: false });

      if (values.animal.length > 0) {
        let newfilteredList = await getAnimalNamesThatFit(values.animal);
        let animalArray = [];
        newfilteredList.forEach((animal) => {
          if (!animalArray.includes(animal.label)) {
            animalArray.push(animal.label);
          }
        });
        setList(animalArray);
      } else {
        setList([]);
      }
    } else {
      setPin({ ...pin, Animal: values.animal });
      setList([]);
      Keyboard.dismiss();
    }
  };

  const handleChange = async (text) => {
    if (!textSource) {
      handleList({ animal: text, value: 1 });
    }
  };

  const handleClear = () => {
    setTextSource(false);
    setPin({ ...pin, Animal: "" });
    setList([]);
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={AnimalKeboardOffset}
      style={styles.autocomplete}
    >
      <View style={styles.mainBox}>
        <View style={styles.container}>
          <InputField
            validationItem={formValidation.AnimalVal}
            placeHolderText={"Animal"}
            inputValue={pin.Animal}
            keyboardType={"default"}
            onChangeText={handleChange}
          />

          {pin.Animal.length > 1 && (
            <View style={styles.xButton}>
              <TouchableOpacity
                onPress={handleClear}
                style={{
                  width: moderateScale(18),
                  height: moderateScale(18),
                }}
              >
                <MaterialIcons
                  name="highlight-remove"
                  size={moderateScale(18)}
                  color="lightgrey"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {list.length > 0 &&
          list.map((animal) => {
            return (
              <AutoSuggestListItem
                key={animal}
                name={animal}
                pin={pin}
                setPin={setPin}
                setList={setList}
                handleList={handleList}
                setTextSource={setTextSource}
              />
            );
          })}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#538bdb"
  },
  mainBox: {
    height: "10%",
    width: moderateScale(200),
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "yellow",
    zIndex: 70,
    marginTop: scale(3),
  },
  xButton: {
    marginTop: moderateScale(12),
    marginLeft: moderateScale(-30),
    // backgroundColor: "yellow",
  },
  suggestInput: {
    borderRadius: moderateScale(25),
    height: moderateScale(40),
    width: moderateScale(200),
    backgroundColor: "#538bdb",
    // borderRadius: 10,
    fontSize: moderateScale(16),
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  suggestInputRed: {
    borderRadius: moderateScale(25),
    height: moderateScale(40),
    width: moderateScale(200),
    backgroundColor: "pink",
    // borderRadius: 10,
    fontSize: moderateScale(16),
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  autocomplete: {
    zIndex: 1,
  },
});
