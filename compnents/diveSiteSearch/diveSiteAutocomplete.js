import React, { useState, useEffect, useContext, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { diveSites } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { MapBoundariesContext } from "../contexts/mapBoundariesContext";
import addIndexNumber from "../helpers/optionHelpers";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { DiveSiteSearchModalContext } from "../contexts/diveSiteSearchContext";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { TutorialContext } from "../contexts/tutorialContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scale, moderateScale } from "react-native-size-matters";

export default function DiveSiteAutoComplete(props) {
  const { setDiveSearchHide } = props;
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { boundaries } = useContext(MapBoundariesContext);
  const [list, setList] = useState([]);

  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { diveSiteSearchModal, setDiveSiteSearchModal } = useContext(DiveSiteSearchModalContext);
  

  let diveSiteData

  const handleDiveSiteList = async () => {
    let diveSiteArray = []

    let minLat = boundaries[1]
    let maxLat = boundaries[3]

    let minLng = boundaries[0] 
    let maxLng = boundaries[2]

    diveSiteData = null
    diveSiteArray = []

    if (boundaries.length > 0 ){
      diveSiteData = await diveSites({minLat, maxLat, minLng, maxLng},"");
    }

    if (diveSiteData){
    diveSiteData.forEach((diveSite) => {
      if (!diveSiteArray.includes(diveSite.name)){
        diveSiteArray.push(diveSite.name)
      }
    })
    setList(addIndexNumber(diveSiteArray));
  }
  }

  useEffect(() => {
    handleDiveSiteList()
  }, []);

  useEffect(() => {
    handleDiveSiteList()
  }, [boundaries]);

  const handleConfirm = async(diveSite) => {
    if (diveSite !== null) {
      let minLat2 = boundaries[1]
      let maxLat2 = boundaries[3]
  
      let minLng2 = boundaries[0] 
      let maxLng2 = boundaries[2]

      let diveSiteSet = await diveSites({minLat: minLat2, maxLat: maxLat2, minLng: minLng2, maxLng: maxLng2},"");

      if(diveSiteSet){
       
        diveSiteSet.forEach((site) => {
          if(site.name === diveSite.title)
          setSelectedDiveSite({SiteName: site.name, Latitude: site.lat, Longitude: site.lng});
          
          if (tutorialRunning) {
            if (itterator2 === 5) {
              setItterator2(itterator2 + 1);
            }
          }
        })
      }
     
    }
    setDiveSiteSearchModal(false)
    Keyboard.dismiss()
  };

  const handleClear = () => {
    handleDiveSiteList()
  };

  const handleChangeText = () => {
    handleDiveSiteList()
  };
  
  
  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      
      <AutocompleteDropdown
        // initialValue={'1'}
        textInputProps={{
          style: {
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            borderRadius: moderateScale(25),
            width: moderateScale(200),
            opacity: 1,
            height: moderateScale(40),
          },
        }}
        inputContainerStyle={{
          alignItems: "center",
          height: moderateScale(35),
          borderRadius: moderateScale(30),
          backgroundColor: "white",
          width: moderateScale(200),
          zIndex: 2,
         
        }}
        direction={"down"}
        dataSet={list}
        onSelectItem={(text) => handleConfirm(text)}
        onChangeText={() => handleChangeText}
        onFocus={() => handleChangeText}
        onBlur={() => handleChangeText}
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
    borderRadius: 10,
    zIndex: 1,
    marginTop: moderateScale(70)
  },
});
