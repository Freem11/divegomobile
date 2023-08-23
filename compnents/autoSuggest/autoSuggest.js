import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native";
import { getAnimalNamesThatFit } from "../../supabaseCalls/photoSupabaseCalls";
import AutoSuggestListItem from "./autoSuggestListItem";
import { MaterialIcons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import { TutorialContext } from "../contexts/tutorialContext";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { PictureAdderContext } from "../contexts/picModalContext";
import { TouchableOpacity } from "react-native-gesture-handler";

let waiter;

export default function AnimalAutoSuggest(props) {
  const { setPin, pin, formValidation, SetFormValidation } = props;
  const [list, setList] = useState([]);
  const [textSource, setTextSource] = useState(false);

  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

useEffect(() => {

  clearTimeout(waiter)
  
  if (tutorialRunning) {
    if (itterator3 === 13) {
      waiter = setTimeout(() => {
        setItterator3(itterator3 + 1);
      }, 2000);
      
    }
  } 

}, [pin.Animal])

useEffect(() => {

 if (!picAdderModal){
   setTextSource(false)
 }

}, [picAdderModal])

// useEffect(() => {
//     setTextSource(false)
//  }, [pin])
 

const handleList = async (values) => {

  if (values.value === 1){
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
    if(!textSource){
      handleList({animal: text, value : 1})
    } 
  };

  const handleClear = () => {
    setTextSource(false)
    setPin({ ...pin, Animal: "" });
    setList([]);
    Keyboard.dismiss();
  };

  return (
    <View>
      <View style={styles.container}>
        <InsetShadow
          containerStyle={{
            borderRadius: 25,
            height: 40,
            width: 200,
          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={
              formValidation.AnimalVal
                ? styles.suggestInputRed
                : styles.suggestInput
            }
            placeholder={"Animal"}
            value={pin.Animal}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            onChangeText={handleChange}
          ></TextInput>
        </InsetShadow>
        {pin.Animal.length > 1 && (
            <View style={styles.xButton}>
            <TouchableOpacity
                onPress={handleClear}
                style={{
                  width: 18,
                  height: 18,
                }}
              >
              <MaterialIcons
                name="highlight-remove"
                size={18}
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    overflow: "hidden",
  },
  xButton: {
    marginTop: 10,
    marginLeft: -30,
  },
  suggestInput: {
    width: 200,
    height: 40,

    backgroundColor: "#538bdb",
    borderRadius: 10,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "IndieFlower_400Regular",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  suggestInputRed: {
    width: 200,
    height: 40,
    backgroundColor: "pink",
    borderRadius: 10,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "IndieFlower_400Regular",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
});
