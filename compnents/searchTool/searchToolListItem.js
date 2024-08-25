import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
} from "react-native";
import Geocoder from "react-native-geocoding";
import { moderateScale } from "react-native-size-matters";
import { LargeModalContext } from "../contexts/largeModalContext";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { PinSpotContext } from "../contexts/pinSpotContext";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { getSingleDiveSiteByNameAndRegion } from "../../supabaseCalls/diveSiteSupabaseCalls";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";

let GoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default SearchToolListItem = (props) => {
  const { setList, key, name, soureImage, setSearchValue } =
    props;
  const { setMapCenter } = useContext(MapCenterContext);
  const { setDragPin } = useContext(PinSpotContext);
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { largeModal, setLargeModal } = useContext(LargeModalContext);

  Geocoder.init(GoogleMapsApiKey);

  const handleMapOptionSelected = async (place) => {
    Geocoder.from(place)
      .then((json) => {
        var location = json.results[0].geometry.location;
        setMapCenter({
          lat: location.lat,
          lng: location.lng,
        });
        setDragPin({
          lat: location.lat,
          lng: location.lng,
        });
        setPreviousButtonID(activeButtonID);
        setActiveButtonID("DiveSiteSearchButton");
        useButtonPressHelper(
          "DiveSiteSearchButton",
          activeButtonID,
          largeModal,
          setLargeModal
        );
        setSearchValue('')
        setList([])
        Keyboard.dismiss();
      })
      .catch((error) => console.warn(error));
  };

  const handleDiveSiteOptionSelected = async (diveSite) => {
    if (diveSite !== null) {
      let nameOnly = diveSite.split(" ~ ");
      let diveSiteSet = await getSingleDiveSiteByNameAndRegion({
        name: nameOnly[0],
        region: nameOnly[1],
      });

      if (diveSiteSet) {
        setSelectedDiveSite({
          SiteName: diveSiteSet[0].name,
          Latitude: diveSiteSet[0].lat,
          Longitude: diveSiteSet[0].lng,
        });
        setDragPin({
          lat: diveSiteSet[0].lat,
          lng: diveSiteSet[0].lng,
        });
      }
      setPreviousButtonID(activeButtonID);
      setActiveButtonID("DiveSiteSearchButton");
      useButtonPressHelper(
        "DiveSiteSearchButton",
        activeButtonID,
        largeModal,
        setLargeModal
      );
      setSearchValue('')
      setList([])
      Keyboard.dismiss();
    }
  };
  return (
    <View id={name} key={key} style={styles.suggestion}>
      <View style={{ paddingLeft: moderateScale(8), justifyContent: "center" }}>
        <TouchableWithoutFeedback
          onPress={() =>
            soureImage === "anchor"
              ? handleDiveSiteOptionSelected(name)
              : handleMapOptionSelected(name)
          }
          style={{
            width: "100%",
            height: moderateScale(30),
          }}
        >
          <View style={styles.searchCard}>
            {soureImage === "anchor" ? (
              <Image
                style={styles.logo}
                source={require("../png/mapIcons/AnchorGold.png")}
              ></Image>
            ) : (
              <Image
                style={styles.logo}
                source={require("../png/compass.png")}
              ></Image>
            )}
            <Text
              style={{
                fontFamily: "Itim_400Regular",
                fontSize: moderateScale(20),
                textAlign: "left",
                color: "#F0EEEB",
                width: "86s%",
                overflow: "scroll",
              }}
            >
              {name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestion: {
    height: moderateScale(40),
    width: moderateScale(320),
    backgroundColor: "#538dbd",
    borderRadius: 5,
    textAlign: "center",
    justifyContent: "center",
    listStyle: "none",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 20,
  },
  searchCard: {
    flexDirection: "row",
    alignContent: "center",
  },
  logo: {
    paddingLeft: moderateScale(20),
    marginRight: moderateScale(10),
    height: moderateScale(20),
    width: moderateScale(20),
    marginTop: moderateScale(2),
  },
});
