import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { moderateScale } from "react-native-size-matters";
import DiveSiteAutoComplete from "../diveSiteSearch/diveSiteAutocomplete";
import { SmallModalContext } from "../contexts/smallModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { TutorialContext } from "../../compnents/contexts/tutorialContext";
import { Iterrator2Context } from "../../compnents/contexts/iterrator2Context";
import ModalHeader from "../reusables/modalHeader";

export default function DiveSiteSearchModal(props) {
  const { setDiveSearchBump } = props;
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(ActiveButtonIDContext);
 
  const { setDiveSiteAdderModal } = useContext(DSAdderContext);
  const { tutorialRunning } = useContext(TutorialContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);


  const toggleDiveSiteSearchModal = () => {
    setPreviousButtonID(activeButtonID)
    setActiveButtonID("DiveSiteSearchButton")
    setSmallModal(!smallModal);
  };

  const swapToSiteAdd = () => {
    setDiveSiteAdderModal(true);
    setPreviousButtonID(activeButtonID)
    setActiveButtonID("DiveSiteSearchButton")
    setSmallModal(!smallModal);
  };

//////////// need to refactor for guide ////////////

  // useEffect(() => {
  //   if (tutorialRunning) {
  //     if (itterator2 === 3) {
  //       setItterator2(itterator2 + 1);
  //     }
  //   }
  // }, [diveSiteSearchModal]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ModalHeader
          titleText={"Dive Site Search"}
          onClose={toggleDiveSiteSearchModal}
          icon={null}
          altButton={null}
        />
        <DiveSiteAutoComplete setDiveSearchBump={setDiveSearchBump} />
        <TouchableWithoutFeedback onPress={swapToSiteAdd}>
          <Text style={styles.siteAddPrompt}>
            Can't find your dive site? Tap here to add it!
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(15),
    width: "98%",
  },
  siteAddPrompt: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(12),
    alignSelf: "center",
    color: "#F0EEEB",
    position: "absolute",
    bottom: moderateScale(7),
    right: moderateScale(10),
  },
});
