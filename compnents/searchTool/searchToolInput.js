import React from "react";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Keyboard, Dimensions } from "react-native";
import { addIconType, addIndexNumber } from "../helpers/optionHelpers";
import TextInputField from "../authentication/textInput";
import { scale, moderateScale } from "react-native-size-matters";
import { getSiteNamesThatFit } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { MapBoundariesContext } from "../contexts/mapBoundariesContext";;

let GoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const windowHeight = Dimensions.get("window").height;

offset = 0;
if (windowHeight < 700) {
  offset = 700;
} else {
  offset = 1000;
}

export default function SearchToolInput(props) {
  const {
    setList,
    list,
    setSearchValue,
    searchValue,
    setTextSource,
    icon,
    placeHolderText,
    vectorIcon,
  } = props;
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { boundaries } = useContext(MapBoundariesContext);
  const [isClearOn, setIsClearOn] = useState(false);

  const getPlaces = async (text) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GoogleMapsApiKey}`
      );
      const placeInfo = await res.json();
      if (placeInfo) {
        return placeInfo.predictions;
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleDataList = async (value) => {
    let diveSiteArray = [];
    let placesArray = [];

    placesData = null;
    diveSiteData = null;
    diveSiteArray = [];

    if (boundaries.length > 0) {
      diveSiteData = await getSiteNamesThatFit(value);
    } else {
      diveSiteData = null;
    }

    placesData = await getPlaces(value);

    if (placesData) {
      placesData.forEach((place) => {
        placesArray.push(place.description);
      });
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
    }
    let megaArray = [
      ...addIconType(placesArray, "compass"),
      ...addIconType(diveSiteArray, "anchor"),
    ];
    setList(addIndexNumber(megaArray));
  };

  const handleChange = (text) => {
    if (isClearOn){
      setIsClearOn(false)
      return
    }
    setSearchValue(text);
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("DiveSiteSearchButton");
    handleDataList(text);
    
  };

  const handleClear = () => {
    setIsClearOn(true)
    setList([]);
    setTextSource(false);
    setSearchValue("");
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (searchValue.length === 0) {
      setList([]);
    }
  }, [searchValue]);

  return (
    <View style={styles.mainBox}>
      <View style={styles.container}>
        <TextInputField
          icon={icon}
          inputValue={searchValue}
          placeHolderText={placeHolderText}
          vectorIcon={vectorIcon}
          onChangeText={handleChange}
          handleClear={handleClear}
          animal={searchValue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: moderateScale(5),
  },
  mainBox: {
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "yellow",
    marginTop: scale(-10),
  },
  xButton: {
    marginTop: moderateScale(31),
    marginLeft: moderateScale(-30),
    // backgroundColor: "yellow",
  },
  suggestInput: {
    borderRadius: moderateScale(25),
    height: moderateScale(40),
    width: moderateScale(200),
    backgroundColor: "#538bdb",
    // borderRadius: 10,
    fontSize: moderateScale(16),
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  suggestInputRed: {
    borderRadius: moderateScale(25),
    height: moderateScale(40),
    width: moderateScale(200),
    backgroundColor: "pink",
    fontSize: moderateScale(16),
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  autocomplete: {
    zIndex: 1,
  },
});
