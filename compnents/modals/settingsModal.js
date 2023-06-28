import React, { useState, useContext } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback } from "react-native";
import { signOut } from "../../supabaseCalls/authenticateSupabaseCalls";
import { SessionContext } from "../../compnents/contexts/sessionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsModal() {

  const { activeSession, setActiveSession } = useContext(SessionContext);

const handleLogout = async() => {
  await AsyncStorage.removeItem("token");
  await signOut()
  setActiveSession(null)
}

  return (
    <ScrollView>
      <View style={styles.container}>

      <TouchableWithoutFeedback onPress={handleLogout}>
        <View style={[styles.logoutButton]}>
          <Text
            style={{
              paddingBottom: 5,
              fontFamily: "Caveat_700Bold",
              color: "gold",
              fontSize: 22
            }}
          >
             Sign Out
          </Text>
        </View>
      </TouchableWithoutFeedback>

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: "30%",
    marginTop: "5%",
    marginRight: 10,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  
});
