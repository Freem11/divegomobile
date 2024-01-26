import React, { useContext, useEffect } from "react";
import { StyleSheet, View, Dimensions, Keyboard } from "react-native";
import PlacesInput from "react-native-places-input";
import config from "../../config";
import { MapCenterContext } from "../contexts/mapCenterContext";
import { MapSearchModalContext } from "../contexts/mapSearchContext";
import { scale, moderateScale } from "react-native-size-matters";

export default function GeocodeAutoComplete(props) {
  const { setGeoHide } = props;
  const { mapCenter, setMapCenter } = useContext(MapCenterContext);
  const { mapSearchModal, setMapSearchModal } = useContext(MapSearchModalContext);
  
  const handleConfirm = async (place) => {
      setMapCenter({
        lat: place.result.geometry.location.lat,
        lng: place.result.geometry.location.lng,
      });
      setMapSearchModal(false)
      Keyboard.dismiss();
  };

  return (
    <View style={styles.container} pointerEvents={"box-none"}>
      <PlacesInput
        googleApiKey={config.GOOGLE_MAPS_API_KEY}
        placeholder={"Go to..."}
        language={"en-US"}
        onSelect={((place) => handleConfirm(place))}
        stylesList={{ borderRadius: 10 }}
        stylesInput={{ borderRadius: moderateScale(10), height: moderateScale(30), width: moderateScale(200) }}
        textInputProps={{ backgroundColor: "white", width: moderateScale(200), fontSize: moderateScale(12)}}
        clearQueryOnSelect={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    width: moderateScale(220),
    // height: scale(500),
    backgroundColor: "white",
    borderRadius: 10,
    zIndex: 1,
    marginTop: moderateScale(10)
  },
});
