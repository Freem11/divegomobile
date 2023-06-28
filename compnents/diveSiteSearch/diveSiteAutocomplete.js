import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { diveSites } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { MapBoundariesContext } from "../contexts/mapBoundariesContext";
import addIndexNumber from "../helpers/optionHelpers";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";

export default function DiveSiteAutoComplete() {
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { boundaries } = useContext(MapBoundariesContext);
  const [list, setList] = useState([]);

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
      diveSiteData = await diveSites({minLat, maxLat, minLng, maxLng});
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

      let diveSiteSet = await diveSites({minLat: minLat2, maxLat: maxLat2, minLng: minLng2, maxLng: maxLng2});

      if(diveSiteSet){
       
        diveSiteSet.forEach((site) => {
          if(site.name === diveSite.title)
          setSelectedDiveSite({SiteName: site.name, Latitude: site.lat, Longitude: site.lng});
        })
      }
     
    }
  };

  const handleClear = () => {
    handleDiveSiteList()
  };

  const handleChangeText = () => {
    handleDiveSiteList()
  };

  return (
    <View style={styles.container}>
      <AutocompleteDropdown
        initialValue="Species"
        textInputProps={{
          style: {
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            width: 200,
            opacity: 1,
            height: 40,
            marginBottom: 5
          },
        }}
        inputContainerStyle={{
          height: 40,
          borderRadius: 30,
          backgroundColor: "white",
          width: 200,
          zIndex: 2,
         
        }}
        direction={"down"}
        dataSet={list}
        onSelectItem={(text) => handleConfirm(text)}
        onChangeText={() => handleChangeText}
        onFocus={() => handleChangeText}
        onBlur={() => handleChangeText}
        showChevron={false}
        showClear={true}
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
    width: 200,
    borderRadius: 10,
    zIndex: 1,
  },
});
