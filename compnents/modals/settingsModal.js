import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from '@expo/vector-icons';
import { signOut, userDelete } from "../../supabaseCalls/authenticateSupabaseCalls";
import { addDeletedAccountInfo } from "../../supabaseCalls/accountSupabaseCalls";
import { SessionContext } from "../../compnents/contexts/sessionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import email from "react-native-email";

export default function SettingsModal() {
  const { activeSession, setActiveSession } = useContext(SessionContext);

  const dangerZoneHeight = useSharedValue(0);
  const dangerZoneOpacity = useSharedValue(0);
  const [dangerZoneEnabled, setDangerZoneEnabled] = useState(false)

  const dangerZoneReveal = useAnimatedStyle(() => {
    return {
       height: dangerZoneHeight.value,
       opacity: dangerZoneOpacity.value
    };
  });

  const startDangerZoneAnimations = () => {
    if (dangerZoneHeight.value === 0) {
      dangerZoneHeight.value = withSpring(80);
      dangerZoneOpacity.value = withTiming(1);
      setDangerZoneEnabled(false)
    } else {
      dangerZoneHeight.value = withTiming(0);
      dangerZoneOpacity.value = withTiming(0);
      setDangerZoneEnabled(true)
    }
  };

  const handleLogout = async () => {
    await setActiveSession(null);
    await AsyncStorage.removeItem("token");
    await signOut();
  };

  const alertHandler = async () => {
    Alert.alert('You Are About To Delete Your DiveGo Account', 'Are you sure you want to delete your account?' + '\n' + '\n' + 'Please note that deleting your account will not delete your previous dive site or photos submittsion, please contact us if you wish to have those removed from the community',
    [
      {text: "Delete My Account", onPress: () => handleAccountDelete()},
      {text: "Cancel Request", onPress: () => console.log("no tapped")},
      {text: "Contact DiveGo", onPress: () => handleEmail()}
    ])
  };

  const handleAccountDelete = async () => {
    await addDeletedAccountInfo({
      firstName: activeSession.user.user_metadata.firstName,
      lastName: activeSession.user.user_metadata.lastName,
      email: activeSession.user.email,
      UserID: activeSession.user.id
    })
    await userDelete(activeSession.user.id)
    await setActiveSession(null);
    await AsyncStorage.removeItem("token");
    await signOut();
  };

  const handleEmail = () => {
    const to = ["DiveGo2022@gmail.com"];
    email(to, {
      subject: `Delete Account Request: ${activeSession.user.user_metadata.firstName} ${activeSession.user.user_metadata.lastName}'s Account `,
      body:
        "Hello I am deleting my DiveGo account and would also like to also have the following of my submissions removed as well \n \n My Dive Sites (Y/N) \n My Photo Submissions (Y/N) \n \n As removing these submisions would diminish the experience for others divers in the community, would you be willing to negotiate with DiveGo to allow these to stay in the app? (Y/N)",
      checkCanOpen: false,
    }).catch(console.error);
  };

  const [signButState, setSignButState] = useState(false);
  const [dangerButState, setDangerButState] = useState(false);

  return (
    <ScrollView style={{height: "100%", width: "86%"}}>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={handleLogout}
          onPressIn={() => setSignButState(true)}
          onPressOut={() => setSignButState(false)}
        >
          <View
            style={
              signButState ? styles.logoutButtonpressed : styles.logoutButton
            }
          >
            <Text
              style={{
                paddingBottom: 5,
                fontFamily: "Caveat_700Bold",
                color: "gold",
                fontSize: 22,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <TouchableWithoutFeedback
        onLongPress={startDangerZoneAnimations}
        style={{backgroundColor: "purple"}}
      >
        <View style={styles.dangerZonebar}>
        <AntDesign name="exclamationcircleo" size={20} color="maroon" />
        <Text style={styles.dangerText}>Danger Zone</Text>
        <AntDesign name="exclamationcircleo" size={20} color="maroon" />
        
        </View>
      </TouchableWithoutFeedback>

      <Animated.View
        style={[dangerZoneReveal, styles.dangerZone]}
      >
         <TouchableWithoutFeedback
          disabled={dangerZoneEnabled}
          onPressIn={() => setDangerButState(true)}
          onPressOut={() => setDangerButState(false)}
          onLongPress={alertHandler}
        >
          <View
            style={
              dangerButState ? styles.deleteAccountButtonPressed : styles.deleteAccountButton
            }
          >
            <Text
              style={{
                paddingBottom: 5,
                fontFamily: "Caveat_700Bold",
                color: "maroon",
                fontSize: 22,
              }}
            >
              Delete Account
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30%",
    marginTop: "5%",
    marginBottom: "80%",
    height: "100%",
    marginRight: 20,
    marginLeft: 10,
    // backgroundColor: "green"
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
  logoutButtonpressed: {
    backgroundColor: "#538dbd",
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
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  dangerZonebar:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: 'center',
    width: "80%",
    height: 25,
    backgroundColor: "pink",
    opacity: 0.65,
    borderRadius: 10,
    marginTop: "85%",
    paddingLeft: 5,
    paddingRight: 5
  },
  dangerZone:{
    width: "75%",
    borderWidth: 0.5,
    // backgroundColor: "green",
    borderColor: "darkgrey",
    alignSelf: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android"? 4 : 1,
  },
  dangerText:{
    color: "maroon",
  },
  deleteAccountButton: {
    backgroundColor: "pink",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    marginTop: 20,
    zIndex: -1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: -1,
    zIndex : -1
  },
  deleteAccountButtonPressed: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: -1,
    zIndex: -1
  },
});
