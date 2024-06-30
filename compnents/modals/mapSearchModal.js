import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
import GeocodeAutoComplete from "../locationSearch/geocodeAutocomplete";
import { MapSearchModalContext } from "../../compnents/contexts/mapSearchContext";
import { MapCenterContext } from "../../compnents/contexts/mapCenterContext";
import { getCurrentCoordinates } from "../helpers/permissionsHelpers";
import ModalHeader from "../reusables/modalHeader";

export default function MapSearchModal(props) {
  const { setMapSearchBump } = props;
  const [profileCloseState, setProfileCloseState] = useState(false);
  const [myLocButState, setMyLocButState] = useState(false);
  const { mapSearchModal, setMapSearchModal } = useContext(MapSearchModalContext);
  const { mapCenter, setMapCenter } = useContext(MapCenterContext);
  
  const toggleMapSearchModal = () => {
    setMapSearchModal(false)
  }

  const getCurrentLocation = async () => {
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setMapCenter({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        setMapSearchModal(false)
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
    <ModalHeader
        titleText={"Map Search"}
        onClose={toggleMapSearchModal}
        icon={null}
        altButton={null}
      />
      <Text style={styles.buttonlabel}>My Current Location:</Text>
      <View style={myLocButState ? styles.GPSbuttonPressed : styles.GPSbutton}>
      <TouchableWithoutFeedback
          onPress={getCurrentLocation}
          onPressIn={() => setMyLocButState(true)}
          onPressOut={() => setMyLocButState(false)}
          style={{
            alignItems: "center",
            width: moderateScale(26),
            height: moderateScale(26),
          }}
        >
          <MaterialIcons
            name="my-location"
            size={moderateScale(26)}
            color={myLocButState ? "lightblue" : "gold"}
          />
        </TouchableWithoutFeedback>
        </View>
      <GeocodeAutoComplete 
      setMapSearchBump={setMapSearchBump}/>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
    width: "98%"
  },
  GPSbutton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(30),
    width: moderateScale(50),
    marginTop: moderateScale(-23),
    marginLeft: moderateScale(140),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  GPSbuttonPressed: {
    backgroundColor: "#FAF9F1",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(30),
    width: moderateScale(50),
    marginTop: moderateScale(-23),
    marginLeft: moderateScale(140),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  }, 
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(14),
    marginTop: moderateScale(15),
    marginLeft: moderateScale(-60)
  },
});
