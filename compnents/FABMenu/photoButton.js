import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale, moderateScale } from 'react-native-size-matters';
import { ShopModalContext } from "../contexts/shopModalContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { TutorialLaunchPadContext } from "../contexts/tutorialLaunchPadContext";
import { MapSearchModalContext } from "../contexts/mapSearchContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { SettingsContext } from "../contexts/gearModalContext";
import { DiveSiteSearchModalContext } from "../contexts/diveSiteSearchContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";

export default function PhotoButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(ActiveButtonIDContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(LargeModalSecondContext);
  
  const { tiles, setTiles } = useContext(CarrouselTilesContext);
  const { showFilterer, setShowFilterer } = useContext(
    PullTabContext
  );
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);
  const { setMapSearchModal } = useContext(MapSearchModalContext);
  const { setTutorialLaunchpadModal } = useContext(TutorialLaunchPadContext);
  const { setDiveSiteAdderModal } = useContext(DSAdderContext);
  const { setProfileModal } = useContext(ProfileModalContext);
  const { setGearModal } = useContext(SettingsContext);
  const { setDiveSiteSearchModal } = useContext(DiveSiteSearchModalContext);
  const { setSiteModal } = useContext(AnchorModalContext);
  const { setShopModal } = useContext(ShopModalContext);

  const { itterator, setItterator } = useContext(IterratorContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  
  let counter = 0;
  let blinker;

  function photoAdd() {
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
      if (itterator3 === 5) {
        blinker = setInterval(photoAdd, 1000);
      }
    }
    return () => cleanUp();
  }, [itterator3]);

  useEffect(() => {
    if(picAdderModal) {
      setDiveSiteAdderModal(false);
      setTutorialLaunchpadModal(false);
      setMapSearchModal(false);
      setProfileModal(false);
      setGearModal(false);
      setDiveSiteSearchModal(false);
      setSiteModal(false);
      setShopModal(false);
      setShowFilterer(false);
      setTiles(true);
    }
  }, [picAdderModal]);

  const handlePress = () => {
    setPreviousButtonID(activeButtonID)
    setActiveButtonID('PictureAdderButton')
    setLargeModalSecond(!largeModalSecond)
  }

  return (
    <View style={styles.container}>
     <TouchableWithoutFeedback
          onPress={itterator === 11 || itterator === 15 || itterator === 18 || itterator2 === 3 || itterator2 === 5 || itterator2 === 9 ? null : handlePress}
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
            name="photo-camera"
            color={butState ? "gold" : "white"}
            size={moderateScale(34)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>Photo Add</Text>
          </View>
        </TouchableWithoutFeedback>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
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
    fontSize: moderateScale(13),
    marginTop: moderateScale(0)
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(13),
    marginTop: moderateScale(0)
  },
});
