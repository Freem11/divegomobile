import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { scale } from 'react-native-size-matters';
import { ProfileModalContext } from "../contexts/profileModalContext";

export default function Logo() {

  const { profileModal, setProfileModal } = useContext(
    ProfileModalContext
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: "Caveat_400Regular", fontSize: scale(16) }} onPress={() => setProfileModal(true)}>Scuba SEAsons</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    backgroundColor: "white",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    height: scale(55),
    borderTopRightRadius: scale(15),
    width: "21%",
    paddingRight: 2,
    paddingLeft: -10,
    paddingTop: -10,
    paddingBottom: -10,
    fontSize: "2rem"
  },
});
