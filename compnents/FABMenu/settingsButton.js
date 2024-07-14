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
import { LargeModalContext } from '../contexts/largeModalContext';
import { useButtonPressHelper } from './buttonPressHelper';

export default function SettingsButton() {
  const [butState, setButState] = useState(false);
  const { activeButtonID, setActiveButtonID } = useContext(ActiveButtonIDContext);
  const { previousButtonID, setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);

  const { tiles, setTiles } = useContext(CarrouselTilesContext);
  const { showFilterer, setShowFilterer } = useContext(
    PullTabContext
  );
  const { gearModal, setGearModal } = useContext(SettingsContext);
  const { setProfileModal } = useContext(ProfileModalContext);
  const { setPicAdderModal } = useContext(PictureAdderContext);
  const { setMapSearchModal } = useContext(MapSearchModalContext);
  const { setTutorialLaunchpadModal } = useContext(TutorialLaunchPadContext);
  const { setDiveSiteAdderModal } = useContext(DSAdderContext);
  const { setDiveSiteSearchModal } = useContext(DiveSiteSearchModalContext);
  const { setSiteModal } = useContext(AnchorModalContext);
  const { setShopModal } = useContext(ShopModalContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  
  useEffect(() => {
    if(gearModal){
      setDiveSiteAdderModal(false);
      setTutorialLaunchpadModal(false);
      setMapSearchModal(false);
      setPicAdderModal(false);
      setProfileModal(false);
      setDiveSiteSearchModal(false);
      setSiteModal(false);
      setShopModal(false);
      setShowFilterer(false);
      setTiles(true);
    }
  }, [gearModal]);

  const handlePress = () => {
    setPreviousButtonID(activeButtonID)
    setActiveButtonID('SettingsButton')
    useButtonPressHelper('SettingsButton', activeButtonID, largeModal, setLargeModal)
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
          <MaterialIcons
            name="settings"
            color={butState ? "gold" : "white"}
            size={moderateScale(34)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>Settings</Text>
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
