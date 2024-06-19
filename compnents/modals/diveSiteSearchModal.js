import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Keyboard
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
import DiveSiteAutoComplete from "../diveSiteSearch/diveSiteAutocomplete";
import { DiveSiteSearchModalContext } from "../../compnents/contexts/diveSiteSearchContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { TutorialContext } from "../../compnents/contexts/tutorialContext";
import { Iterrator2Context } from "../../compnents/contexts/iterrator2Context";

export default function DiveSiteSearchModal(props) {
  const { setDiveSearchBump } = props;
  const [profileCloseState, setProfileCloseState] = useState(false);
  const [myLocButState, setMyLocButState] = useState(false);
  const { diveSiteSearchModal, setDiveSiteSearchModal } = useContext(DiveSiteSearchModalContext);
  const { setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  
  const toggleDiveSiteSearchModal = () => {
    setDiveSiteSearchModal(false)
  }

  const swapToSiteAdd = () => {
    setDiveSiteAdderModal(true)
    setDiveSiteSearchModal(false)
  }

  useEffect(() => {
    if (tutorialRunning) {
        if (itterator2 === 3) {
          setItterator2(itterator2 + 1);
        }
    }
  }, [diveSiteSearchModal]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
       <View style={styles.title}>
        <Text style={styles.header}>Dive Site Search</Text>
        <View
          style={
            profileCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableWithoutFeedback
            onPress={toggleDiveSiteSearchModal}
            onPressIn={() => setProfileCloseState(true)}
            onPressOut={() => setProfileCloseState(false)}
            style={{
              width: scale(30),
              height: scale(30),
              alignItems: "center",
            }}
          >
           
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableWithoutFeedback>
        </View>
      </View>
         <DiveSiteAutoComplete 
         setDiveSearchBump={setDiveSearchBump}
         />
         <TouchableWithoutFeedback onPress={swapToSiteAdd}>
         {/* <View style={{position: "absolute", bottom: 10, right: 10, backgroundColor: "pink"}}> */}
         <Text style={styles.siteAddPrompt}>Can't find your dive site? Tap here to add it!</Text> 
         {/* </View> */}
         </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
  },
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: moderateScale(7),
    marginLeft: "8%",
    width: "85%",
    height: scale(40),
    // backgroundColor:"pink"
  },
  header: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(26),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginTop: "-1%",
    marginLeft: "5%",
    marginRight: "5%",
    // backgroundColor: "green"
  },
  text: {
    fontSize: 20,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "0%",
    margin: scale(10),
  },
  text2: {
    fontSize: 18,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "5%",
    marginBottom: "7%",
    margin: scale(35),
  },
  OKbutton: {
    backgroundColor: "#79bace",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.55,
    shadowRadius: 6.27,

    elevation: 10,
  },
  OKbuttonPressed: {
    opacity: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: scale(35),
    width: scale(150),
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  GPSbutton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    height: moderateScale(30),
    width: moderateScale(30),
    marginTop: moderateScale(-25),
    marginLeft: moderateScale(120),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  GPSbuttonPressed: {
    backgroundColor: "#FAF9F1",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    height: moderateScale(30),
    width: moderateScale(30),
    marginTop: moderateScale(-25),
    marginLeft: moderateScale(120),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  }, 
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(14),
    marginTop: moderateScale(70),
    marginLeft: moderateScale(-60)
  },
  siteAddPrompt: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(12),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "100%",
    position: "absolute",
    bottom: scale(5),
    left: scale(30)
    // backgroundColor: "green"
  },
});
