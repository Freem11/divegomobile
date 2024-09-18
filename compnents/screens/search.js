import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { activeFonts, colors, fontSizes } from "../styles";
import screenData from "./screenData.json";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import SearchToolInput from "../searchTool/searchToolInput";
import SearchToolListItem from '../searchTool/searchToolListItem';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SearchPage(props) {
  const {} = props;
  const [list, setList] = useState([]);
  const [textSource, setTextSource] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);

  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );

  useEffect(() => {
    setList([]);
    setTextSource(false);
    setSearchValue("");
  }, [levelOneScreen]);


  const handleSwitch = () => {
    setLevelOneScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("DiveSiteUploadScreen");
    useButtonPressHelper(
      "DiveSiteUploadScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  }
 

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={"darkgrey"}
        onPress={() => setLevelOneScreen(false)}
        style={{ marginTop: "15%", alignSelf: "flex-start", marginLeft: "2%" }}
      />
      <View style={styles.content}>
        <Text style={styles.header}>{screenData.SearchPage.header}</Text>

        <SearchToolInput
          icon="navigate-circle-outline"
          vectorIcon="Ionicons"
          placeHolderText={screenData.SearchPage.placeholder}
          setList={setList}
          list={list}
          setTextSource={setTextSource}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <View style={styles.flatListBox}>
          <FlatList
            style={styles.page}
            contentContainerStyle={styles.pageContainter}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            data={list}
            renderItem={({ item }) => (
              <SearchToolListItem
                name={item.title}
                soureImage={item.source}
                setTextSource={setTextSource}
                setList={setList}
                setSearchValue={setSearchValue}
              />
            )}
          />
        </View>

        <View style={styles.promtBox}>
          <Text style={styles.promptText}>
            {screenData.SearchPage.diveAddPrompt}
          </Text>
          <TouchableWithoutFeedback onPress={() => handleSwitch()}>
            <Text style={styles.promptLinkText}>
              {screenData.SearchPage.diveAddLink}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    height: windowHeight,
  },
  content: {
    width: "90%",
    height: windowHeight - windowHeight * 0.17,
  },
  header: {
    zIndex: 10,
    marginTop: "5%",
    marginBottom: "5%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Bold,
    color: "darkgrey",
  },
  flatListBox: {
    marginTop: windowWidth > 600 ? "0%" : "-3%",
    maxHeight: windowWidth > 600 ?  "63%" : "72%"
  },
  promtBox: {
    position: "absolute",
    bottom: windowWidth > 600 ? moderateScale(50) : moderateScale(10),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  promptText: {
    fontSize: moderateScale(15),
    fontFamily: activeFonts.Italic,
    color: colors.themeBlack,
  },
  promptLinkText: {
    marginLeft: "2%",
    marginTop: moderateScale(1),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.thin,
    color: colors.primaryBlue,
  },
});
