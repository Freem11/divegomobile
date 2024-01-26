import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale, moderateScale } from 'react-native-size-matters';
import { DSAdderContext } from "../contexts/DSModalContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { TutorialContext } from "../contexts/tutorialContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function DiveSiteButton() {
  const [butState, setButState] = useState(false);
  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );
  const { itterator, setItterator } = useContext(IterratorContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  
  let counter = 0;
  let blinker;


  function diveSiteAdd() {
    counter++;
    if (counter % 2 == 0) {
      setButState(false);
    } else {
      setButState(true);
    }
  }

  function cleanUp() {
    clearInterval(blinker);
    setButState(false);
  }

  useEffect(() => {
    if (tutorialRunning) {
      if (itterator2 === 9) {
        blinker = setInterval(diveSiteAdd, 1000);
      }
    }
    return () => cleanUp();
  }, [itterator2]);


  return (
    <View style={styles.container}>
     <TouchableWithoutFeedback
          onPress={() => {itterator === 11 || itterator === 15 || itterator === 18 || itterator2 === 3 || itterator2 === 5 || itterator3 === 5 ? null : setDiveSiteAdderModal(!diveSiteAdderModal)}}
          onPressIn={() => setButState(true)}
          onPressOut={() => setButState(false)}
          style={{
            alignItems: "center",
            width: moderateScale(32),
            height: moderateScale(32),
          }}
        >
        <View style={styles.buttonBox}>
          <MaterialIcons
            name="add-location-alt"
            color={butState ? "gold" : "white"}
            size={moderateScale(30)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>Site Add</Text>
          </View>
        </TouchableWithoutFeedback>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    fontSize: "2rem"
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "darkgrey",
    // borderRadius: 10,
    backgroundColor: "#538bdb",
    width: moderateScale(80),
    height: moderateScale(55)
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(11),
    marginTop: moderateScale(0)
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(11),
    marginTop: moderateScale(0)
  },
});
