import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import { scale } from 'react-native-size-matters';
import { ProfileModalContext } from "../contexts/profileModalContext";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function SiteSearchButton() {
  const [butState, setButState] = useState(false);

  return (
    <View style={styles.container}>
     <TouchableWithoutFeedback
          //  onPress={itterator === 11 || itterator === 18 || itterator2 === 5 || itterator2 === 9 || itterator3 === 5 ? null : startAnimalButtonAnimations}
          onPressIn={() => setButState(true)}
          onPressOut={() => setButState(false)}
          style={{
            alignItems: "center",
            width: 32,
            height: 32,
          }}
        >
        <View style={styles.buttonBox}>
          <MaterialCommunityIcons
            name="map-search-outline"
            color={butState ? "gold" : "white"}
            size={32}
          />
          <Text style={butState ? styles.buttonlabelAlt : styles.buttonlabel}>Site Search</Text>
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
    borderWidth: 1,
    borderColor: "darkgrey",
    borderRadius: 10,
    backgroundColor: "darkblue",
    width: 90,
    height: "100%"
  },
  buttonlabel: {
    fontFamily: "Itim_400Regular",
    color: "white"
  },
  buttonlabelAlt: {
    fontFamily: "Itim_400Regular",
    color: "gold"
  },
});
