import { StyleSheet, View, Text, Keyboard } from "react-native";
import { TutorialContext } from "../contexts/tutorialContext";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { useState, useEffect, useContext } from "react";

const AutoSuggestListItem = (props) => {
  const { setList, setPin, pin, name } = props;
  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);


  const handleSelect = (text) => {
    setPin({ ...pin, Animal: text });
    setList([]);
    Keyboard.dismiss();

    if (tutorialRunning) {
      if (itterator3 === 13) {
        setItterator3(itterator3 + 1);
      }
    } 
  };

  return (
    <View id={name} style={styles.suggestion}>
      <View style={{zIndex: 100}}>
        <Text
          style={{ fontFamily: "IndieFlower_400Regular", textAlign: "center", color:"#F0EEEB", zIndex: 100 }}
          onPress={() => handleSelect(name)}
        >
          {name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestion: {
    zIndex: 100,
    width: 165,
    height: 25,
    marginTop: 1,
    paddingTop: 3,
    backgroundColor: "#538bdb",
    borderRadius: 5,
    textAlign: "center",
    alignContent: "center",
    listStyle: "none",
    transform: [{ translateX: 18 }],
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 20,
  },
});

export default AutoSuggestListItem;
