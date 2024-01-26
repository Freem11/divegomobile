import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
import GeocodeAutoComplete from "../locationSearch/geocodeAutocomplete";
import { MapSearchModalContext } from "../../compnents/contexts/mapSearchContext";
import { MapCenterContext } from "../../compnents/contexts/mapCenterContext";
import { getCurrentCoordinates } from "../helpers/permissionsHelpers";

export default function MapSearchModal() {
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
    <View style={styles.container}>
       <View style={styles.title}>
        <Text style={styles.header}>Map Search</Text>
        <View
          style={
            profileCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableWithoutFeedback
            onPress={toggleMapSearchModal}
            onPressIn={() => setProfileCloseState(true)}
            onPressOut={() => setProfileCloseState(false)}
            style={{
              width: scale(30),
              height: scale(30),
              alignItems: "center",
            }}
          >
           
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableWithoutFeedback>
        </View>
      </View>
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
      <GeocodeAutoComplete />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
  },
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: moderateScale(7),
    marginLeft: "8%",
    width: "70%",
    height: scale(40),
    // backgroundColor:"pink"
  },
  header: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(26),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginTop: "-1%",
    marginLeft: "7%",
    marginRight: "15%",
    // backgroundColor: "green"
  },
  text: {
    fontSize: 20,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "0%",
    margin: scale(10),
  },
  text2: {
    fontSize: 18,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "5%",
    marginBottom: "7%",
    margin: scale(35),
  },
  OKbutton: {
    backgroundColor: "#79bace",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.55,
    shadowRadius: 6.27,

    elevation: 10,
  },
  OKbuttonPressed: {
    opacity: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: scale(35),
    width: scale(150),
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  GPSbutton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    height: moderateScale(30),
    width: moderateScale(30),
    marginTop: moderateScale(-25),
    marginLeft: moderateScale(120),
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
    borderRadius: moderateScale(10),
    height: moderateScale(30),
    width: moderateScale(30),
    marginTop: moderateScale(-25),
    marginLeft: moderateScale(120),
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
    marginTop: moderateScale(70),
    marginLeft: moderateScale(-60)
  },
});
