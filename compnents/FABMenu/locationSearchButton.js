import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale, moderateScale } from 'react-native-size-matters';
import { ProfileModalContext } from "../contexts/profileModalContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function LocationSearchButton() {
  const [butState, setButState] = useState(false);

  return (
    <View style={styles.container}>
     <TouchableWithoutFeedback
          //  onPress={itterator === 11 || itterator === 18 || itterator2 === 3 || itterator2 === 5 || itterator2 === 9 || itterator3 === 5 ? null : startGeoCodeButtonAnimations}
          onPressIn={() => setButState(true)}
          onPressOut={() => setButState(false)}
          style={{
            alignItems: "center",
            width: moderateScale(32),
            height: moderateScale(32),
          }}
        >
        <View style={styles.buttonBox}>
          <MaterialIcons
            name="explore"
            color={butState ? "gold" : "white"}
            size={moderateScale(32)}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>Map Search</Text>
          </View>
        </TouchableWithoutFeedback>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    fontSize: "2rem"
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "darkgrey",
    // borderRadius: 10,
    backgroundColor: "#536bdb",
    width: moderateScale(80),
    height: moderateScale(55)
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white",
    fontSize: moderateScale(11),
    marginTop: moderateScale(0)
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold",
    fontSize: moderateScale(11),
    marginTop: moderateScale(0)
  },
});
