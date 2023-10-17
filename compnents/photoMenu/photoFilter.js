import React from "react";
import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { scale } from "react-native-size-matters";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchTextContext } from "../contexts/searchTextContext";
import { AreaPicsContext } from "../contexts/areaPicsContext";

export default function PhotoFilterer() {
const { textvalue, setTextValue } = useContext(SearchTextContext);
const { areaPics, setAreaPics } = useContext(AreaPicsContext);

  const handleChange = async (text) => { 
    setTextValue(text);
  };

  const handleClear = () => {
    setTextValue("")
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.suggestInput}
        placeholder={"Dive Deeper!"}
        value={textvalue}
        placeholderTextColor="darkgrey"
        color="black"
        onChangeText={handleChange}
      ></TextInput>
          <TouchableOpacity
          onPress={handleClear}
          style={{
            width: scale(20),
            height: scale(20),
            zIndex: 10,
            // backgroundColor: "pink"
          }}
        >
      <View style={[styles.xButton,  {opacity: textvalue.length > 0 ? 1 : 0}]} onPress={handleClear}>
    
          <MaterialIcons name="highlight-remove" size={scale(14)} color="lightgrey" onPress={handleClear} />
      </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    zIndex: 1,
    width: scale(150),
    borderRadius: scale(10),
    paddingRight: 5,
    paddingLeft: 12,
    fontSize: "2rem",
  },
  suggestInput: {
    fontSize: scale(12),
    width: "75%"
  },
  xButton: {
    // position: "absolute",
    marginTop: scale(3),
    marginLeft: scale(5),
    zIndex: 10
  },
});
