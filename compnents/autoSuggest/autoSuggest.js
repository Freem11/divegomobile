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
import {
  activeFonts,
  colors,
  fontSizes,
} from "../styles";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getAnimalNamesThatFit } from "../../supabaseCalls/photoSupabaseCalls";
import AutoSuggestListItem from "./autoSuggestListItem";
import TextInputField from "../authentication/textInput";
import { scale, moderateScale } from "react-native-size-matters";
import { TutorialContext } from "../contexts/tutorialContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { PictureAdderContext } from "../contexts/picModalContext";
import { TouchableOpacity } from "react-native-gesture-handler";

let waiter;

const windowHeight = Dimensions.get("window").height;

offset = 0
if(windowHeight < 700){
  offset = moderateScale(700)
} else {
  offset = moderateScale(700)
}
const AnimalKeboardOffset = Platform.OS === "ios" ? offset - scale(160) : offset;

export default function AnimalAutoSuggest(props) {
  const { setPinValues, pinValues, inputValue, icon, vectorIcon, secure, placeHolderText} = props;
  const [list, setList] = useState([]);
  const [textSource, setTextSource] = useState(false);
  const { picAdderModal } = useContext(PictureAdderContext);

  
  useEffect(() => {
    if (!picAdderModal) {
      setTextSource(false);
    }
  }, [picAdderModal]);

  const handleList = async (values) => {
    if (values.value === 1) {
      setPinValues({ ...pinValues, Animal: values.animal });

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
      setPinValues({ ...pinValues, Animal: values.animal });
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
    setPinValues({ ...pinValues, Animal: "" });
    setList([]);
    Keyboard.dismiss();
  };

  console.log("THIS", icon)

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={AnimalKeboardOffset}
    >

<View style={styles.inputContainer}>
      <TextInputField
              icon={icon}
              inputValue={inputValue}
              placeHolderText={placeHolderText}
              secure={secure}
              vectorIcon={vectorIcon}
              onChangeText={handleChange}
              handleClear={handleClear}
              animal={pinValues.Animal}
            />
    </View>
     

        {list.length > 0 &&
          list.map((animal) => {
            return (
              <AutoSuggestListItem
                key={animal}
                name={animal}
                pin={pinValues}
                setPin={setPinValues}
                setList={setList}
                handleList={handleList}
                setTextSource={setTextSource}
              />
            );
          })}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: colors.themeWhite,
  },
 inputContainer: {
    flexDirection: "row",
    borderBottomColor: "darkgrey",
    borderBottomWidth: moderateScale(2),
    alignItems: 'center',
    height: moderateScale(30),

  },
  mainBox: {
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "yellow",
    zIndex: 70,
    marginTop: scale(3),
  },
  xButton: {
    zIndex: 90,
    marginTop: moderateScale(0),
    marginLeft: moderateScale(0),
    // backgroundColor: "yellow",
  },
  suggestInput: {
    borderRadius: moderateScale(25),
    height: moderateScale(40),
    width: moderateScale(200),
    backgroundColor: colors.themeWhite,
    // borderRadius: 10,
    fontSize: fontSizes.StandardText,
    textAlign: "center",
    fontFamily: activeFonts.Light,
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  }
});
