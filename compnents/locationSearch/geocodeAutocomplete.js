import React, { useContext } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import PlacesInput from "react-native-places-input";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { SmallModalContext } from '../contexts/smallModalContext';
import { moderateScale } from "react-native-size-matters";
let GoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GeocodeAutoComplete(props) {
  const { setMapSearchBump } = props;
  const { setMapCenter } = useContext(MapCenterContext);
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(ActiveButtonIDContext);

  const handleConfirm = async (place) => {
    setMapCenter({
      lat: place.result.geometry.location.lat,
      lng: place.result.geometry.location.lng,
    });
    setPreviousButtonID(activeButtonID)
    setActiveButtonID("MapSearchButton")
    setSmallModal(!smallModal);
    console.log("WHAT?", activeButtonID)
    Keyboard.dismiss();
  };

  const handleText = async (text) => {
    if (text.length > 0) {
      setMapSearchBump(true);
    }
  };

  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      <PlacesInput
        googleApiKey={GoogleMapsApiKey}
        placeholder={"Go to..."}
        language={"en-US"}
        onSelect={(place) => handleConfirm(place)}
        onChangeText={(text) => handleText(text)}
        stylesList={{ borderRadius: 10 }}
        stylesInput={{
          borderRadius: moderateScale(40),
          height: moderateScale(40),
          width: moderateScale(200),
        }}
        textInputProps={{
          backgroundColor: "white",
          width: moderateScale(200),
          fontSize: moderateScale(16),
        }}
        clearQueryOnSelect={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: moderateScale(220),
    backgroundColor: "white",
    borderRadius: 10,
    zIndex: 1,
    marginTop: moderateScale(3),
  },
});
