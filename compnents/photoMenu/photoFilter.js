import React from "react";
import { useState, useEffect, useContext } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { scale } from "react-native-size-matters";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchTextContext } from "../contexts/searchTextContext";

export default function PhotoFilterer() {
const { textvalue, setTextValue } = useContext(SearchTextContext);

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
          style={{
            width: 18,
            height: 18,
            zIndex: 10
          }}
        >
      <View style={[styles.xButton,  {opacity: textvalue.length > 0 ? 1 : 0}]}>
    
          <MaterialIcons name="highlight-remove" size={18} color="lightgrey" onPress={handleClear} />
      </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    top: scale(120),
    height: scale(25),
    width: "100%",
    borderRadius: scale(10),
    padding: 10,
    paddingLeft: 12,
    fontSize: "2rem",
  },
  suggestInput: {
    height: "100%",
    width: "90%",
    height: 30
  },
  xButton: {
    marginTop: "0%",
    marginLeft: "0%",
  },
});
