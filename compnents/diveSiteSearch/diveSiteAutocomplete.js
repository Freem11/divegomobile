import React, { useState, useEffect, useContext, useRef } from "react";
import { Keyboard, StyleSheet, View, Dimensions } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { getSiteNamesThatFit, getSingleDiveSiteByNameAndRegion } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { MapBoundariesContext } from "../contexts/mapBoundariesContext";
import addIndexNumber from "../helpers/optionHelpers";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { DiveSiteSearchModalContext } from "../contexts/diveSiteSearchContext";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scale, moderateScale } from "react-native-size-matters";

const windowHeight = Dimensions.get("window").height;

export default function DiveSiteAutoComplete(props) {
  const { setDiveSearchBump } = props;
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { boundaries } = useContext(MapBoundariesContext);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { diveSiteSearchModal, setDiveSiteSearchModal } = useContext(
    DiveSiteSearchModalContext
  );

  let diveSiteData;

  const handleDiveSiteList = async (value) => {
    let diveSiteArray = [];

    diveSiteData = null;
    diveSiteArray = [];

    if (boundaries.length > 0) {
      diveSiteData = await getSiteNamesThatFit(value);
    } else {
      diveSiteData = null;
    }

    if (diveSiteData) {
      diveSiteData.forEach((diveSite) => {
        if (!diveSiteArray.includes(diveSite.name)) {
          let fullDSName;
          if (diveSite.region) {
            fullDSName = `${diveSite.name} ~ ${diveSite.region}`;
          } else {
            fullDSName = diveSite.name;
          }
          diveSiteArray.push(fullDSName);
        }
      });
      setList(addIndexNumber(diveSiteArray));
    } else {
      setList([]);
    }
  };

  useEffect(() => {
    handleDiveSiteList();
  }, []);

  useEffect(() => {
    handleDiveSiteList();
  }, [boundaries]);

  useEffect(() => {
    if ( list.length > 0){
      setDiveSearchBump(true)
    }
  }, [list]);

  const handleConfirm = async (diveSite) => {
    if (diveSite !== null) {

      let nameOnly = diveSite.title.split(" ~ ");
      let diveSiteSet = await getSingleDiveSiteByNameAndRegion({ name: nameOnly[0], region: nameOnly[1] });
  
      if (diveSiteSet) {
    
            setSelectedDiveSite({
              SiteName: diveSiteSet[0].name,
              Latitude: diveSiteSet[0].lat,
              Longitude: diveSiteSet[0].lng,
            });

            if (tutorialRunning) {
              if (itterator2 === 5) {
                setItterator2(itterator2 + 1);
              }
            }
          }

      setDiveSiteSearchModal(false);
      Keyboard.dismiss();
    }
  };

  const handleClear = () => {
    handleDiveSiteList();
  };

  const handleChangeText = (value) => {
    handleDiveSiteList(value)
  };

  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      <AutocompleteDropdown
        // initialValue={'1'}
        textInputProps={{
          placeholder: "Search dive sites...",
          style: {
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            borderRadius: moderateScale(50),
            width: moderateScale(200),
            opacity: 1,
            height: moderateScale(50),
            fontSize: moderateScale(16),
          },
        }}
        inputContainerStyle={{
          alignItems: "center",
          height: moderateScale(40),
          borderRadius: moderateScale(40),
          backgroundColor: "white",
          width: moderateScale(200),
          zIndex: 2,
        }}
        suggestionsListContainerStyle={{
          height: list.length > 0 ? (windowHeight/2) : 0
        }}
        direction={"down"}
        dataSet={list}
        onSelectItem={(text) => handleConfirm(text)}
        onChangeText={(text) => handleChangeText(text)}
        onFocus={() => handleChangeText}
        onBlur={() => handleChangeText}
        suggestionsListMaxHeight={1000}
        clearOnFocus={true}
        showChevron={false}
        showClear={false}
        closeOnBlur={true}
        onClear={(text) => handleClear(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    width: moderateScale(200),
    borderRadius: moderateScale(10),
    zIndex: 1,
    marginTop: moderateScale(67)
  },
});
