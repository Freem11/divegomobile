import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale, moderateScale } from 'react-native-size-matters';
import { MapConfigContext } from '../contexts/mapConfigContext';
import { ShopModalContext } from "../contexts/shopModalContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { TutorialLaunchPadContext } from "../contexts/tutorialLaunchPadContext";
import { MapSearchModalContext } from "../contexts/mapSearchContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { SettingsContext } from "../contexts/gearModalContext";
import { DiveSiteSearchModalContext } from "../contexts/diveSiteSearchContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { PullTabContext } from "../contexts/pullTabContext";
import { CarrouselTilesContext } from "../contexts/carrouselTilesContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import TutorialLaunchPadModal from "../modals/tutorialsModal";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { LargeModalContext } from '../contexts/largeModalContext';
import { useButtonPressHelper } from './buttonPressHelper';

export default function GuidesButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID, setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  
  const { tiles, setTiles } = useContext(CarrouselTilesContext);
  const { showFilterer, setShowFilterer } = useContext(
    PullTabContext
  );
  const { tutorialLaunchpadModal, setTutorialLaunchpadModal } = useContext(
    TutorialLaunchPadContext
  );
  const { setDiveSiteAdderModal } = useContext(DSAdderContext);
  const { setMapSearchModal } = useContext(MapSearchModalContext);
  const { setPicAdderModal } = useContext(PictureAdderContext);
  const { setProfileModal } = useContext(ProfileModalContext);
  const { setGearModal } = useContext(SettingsContext);
  const { setDiveSiteSearchModal } = useContext(DiveSiteSearchModalContext);
  const { setSiteModal } = useContext(AnchorModalContext);
  const { setShopModal } = useContext(ShopModalContext);

  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  
  useEffect(() => {
    if(tutorialLaunchpadModal){
      setDiveSiteAdderModal(false);
      setMapSearchModal(false);
      setPicAdderModal(false);
      setProfileModal(false);
      setGearModal(false);
      setDiveSiteSearchModal(false);
      setSiteModal(false);
      setShopModal(false);
      setShowFilterer(false);
      setTiles(true);
    }
  }, [tutorialLaunchpadModal]);

  const handlePress = () => {
    setTiles(true);
    setShowFilterer(false);
    setPreviousButtonID(activeButtonID)
    setActiveButtonID('TutorialsButton')
    useButtonPressHelper('TutorialsButton', activeButtonID, largeModal, setLargeModal)
  }

  return (
    <View style={styles.container}>
     <TouchableWithoutFeedback
          onPress={tutorialRunning ? null : handlePress}
          onPressIn={() => setButState(true)}
          onPressOut={() => setButState(false)}
          style={{
            alignItems: "center",
            width: moderateScale(32),
            height: moderateScale(32),
          }}
        >
        <View style={styles.buttonBox}>
          <FontAwesome5
            name="question"
            color={butState ? "gold" : "white"}
            size={moderateScale(32)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>User Guides</Text>
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
    height: moderateScale(55),
    marginTop: moderateScale(1)
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(13),
    marginTop: moderateScale(2),
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(13),
    marginTop: moderateScale(2)
  },
});
