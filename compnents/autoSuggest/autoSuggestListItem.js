import { StyleSheet, View, Text, Keyboard } from "react-native";
import { useState, useEffect, useContext } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scale, moderateScale } from "react-native-size-matters";

const AutoSuggestListItem = (props) => {
  const { setList, setPin, pin, name, handleList, setTextSource } = props;
 

  const handleSelect = async (text) => {
    setTextSource(true)
    handleList({animal: text, value : 0})
  };

  return (
    <View id={name} style={styles.suggestion}>
      <View style={{zIndex: 100}}>
      <TouchableOpacity
                onPress={() => handleSelect(name)}
                style={{
                  width: moderateScale(170),
                  height: moderateScale(30),
                }}
              >
        <Text
          style={{ fontFamily: "Itim_400Regular", fontSize: moderateScale(15), textAlign: "center", color:"#F0EEEB", zIndex: 100 }}
          onPress={() => handleSelect(name)}
        >
          {name}
        </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestion: {
    zIndex: 2,
    width: moderateScale(165),
    height: moderateScale(25),
    marginTop: 1,
    paddingTop: 3,
    backgroundColor: "#538bdb",
    borderRadius: 5,
    textAlign: "center",
    alignContent: "center",
    listStyle: "none",
    transform: [{ translateX: 18 }],
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 20,
  },
});

export default AutoSuggestListItem;
