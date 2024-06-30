import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
import DiveSiteAutoComplete from "../diveSiteSearch/diveSiteAutocomplete";
import { DiveSiteSearchModalContext } from "../../compnents/contexts/diveSiteSearchContext";
import { DSAdderContext } from "../contexts/DSModalContext";
import { TutorialContext } from "../../compnents/contexts/tutorialContext";
import { Iterrator2Context } from "../../compnents/contexts/iterrator2Context";
import ModalHeader from "../reusables/modalHeader";

export default function DiveSiteSearchModal(props) {
  const { setDiveSearchBump } = props;
  const [profileCloseState, setProfileCloseState] = useState(false);
  const [myLocButState, setMyLocButState] = useState(false);
  const { diveSiteSearchModal, setDiveSiteSearchModal } = useContext(
    DiveSiteSearchModalContext
  );
  const { setDiveSiteAdderModal } = useContext(DSAdderContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);

  const toggleDiveSiteSearchModal = () => {
    setDiveSiteSearchModal(false);
  };

  const swapToSiteAdd = () => {
    setDiveSiteAdderModal(true);
    setDiveSiteSearchModal(false);
  };

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
    backgroundColor: "#538bdb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
  },
  siteAddPrompt: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(12),
    alignSelf: "center",
    color: "#F0EEEB",
    position: "absolute",
    bottom: scale(5),
    right: scale(10),
    // backgroundColor: "green"
  },
});
