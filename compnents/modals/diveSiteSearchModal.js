import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions
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

const windowHeight = Dimensions.get("window").height;

export default function DiveSiteSearchModal() {
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { smallModal } = useContext(SmallModalContext);
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ModalHeader
          titleText={"Map Navigation"}
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
          scrollEnabled={true}
          data={list}
          renderItem={({ item }) => (
            <SearchToolListItem
              key={item.id}
              name={item.title}
              soureImage={item.source}
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
    justifyContent: "center",
    borderRadius: moderateScale(15),
    width: "100%",
  },
  siteAddPrompt: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: moderateScale(16),
    alignSelf: "center",
    color: "#F0EEEB",
    position: "absolute",
    bottom: moderateScale(7),
    right: moderateScale(10),
    // marginTop: "5%"
  },
  page: {
    width: "100%",
    height: "75%",
    marginTop: "0%",
    marginBottom: "10%",
    // backgroundColor: "lightblue",
  },
  pageContainter: {
    alignItems: "center",
    justifyContent: "center",
  },
});
