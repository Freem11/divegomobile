import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { moderateScale } from "react-native-size-matters";
import DiveSiteAutoComplete from "../diveSiteSearch/diveSiteAutocomplete";
import { LargeModalContext } from "../contexts/largeModalContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { TutorialContext } from "../../compnents/contexts/tutorialContext";
import { Iterrator2Context } from "../../compnents/contexts/iterrator2Context";
import ModalHeader from "../reusables/modalHeader";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import SearchToolInput from "../searchTool/searchToolInput";
import SearchToolListItem from "../searchTool/searchToolListItem";

export default function DiveSiteSearchModal(props) {
  const { setDiveSearchBump } = props;
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { tutorialRunning } = useContext(TutorialContext);
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const [list, setList] = useState([]);
  const [textSource, setTextSource] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleDiveSiteSearchModal = () => {
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("DiveSiteSearchButton");
    setLargeModal(false);
  };

  const swapToSiteAdd = () => {
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("DiveSiteAdderButton");
    useButtonPressHelper(
      "DiveSiteAdderButton",
      activeButtonID,
      largeModal,
      setLargeModal
    );
  };

  useEffect(() => {
    if (tutorialRunning) {
      if (itterator2 === 3) {
        setItterator2(itterator2 + 1);
      }
    }
  }, [smallModal]);

  console.log("THIS", list);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ModalHeader
          titleText={"Dive Site Search"}
          onClose={toggleDiveSiteSearchModal}
          icon={null}
          altButton={null}
        />
        <SearchToolInput
          setList={setList}
          list={list}
          setTextSource={setTextSource}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <FlatList
          style={styles.page}
          contentContainerStyle={styles.pageContainter}
          keyExtractor={(item) => item.id}
          scrollEnabled
          data={list}
          renderItem={({ item }) => (
            <SearchToolListItem
              key={item.id}
              name={item.title}
              setTextSource={setTextSource}
              setList={setList}
              setSearchValue={setSearchValue}
            />
          )}
        />
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
    alignItems: "center",
    // justifyContent: "center",
    borderRadius: moderateScale(15),
    width: "100%",
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
  page: {
    width: "100%",
    // backgroundColor: "pink"
  },
  pageContainter: {
    alignItems: "center",
    // backgroundColor: "green"
  },
});
