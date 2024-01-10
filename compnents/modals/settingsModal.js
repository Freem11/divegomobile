import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  Dimensions,
  Switch,
} from "react-native";
import Animated, {
  useSharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import {
  signOut,
  userDelete,
} from "../../supabaseCalls/authenticateSupabaseCalls";
import {
  addDeletedAccountInfo,
  deleteProfile,
} from "../../supabaseCalls/accountSupabaseCalls";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { SessionContext } from "../../compnents/contexts/sessionContext";
import { MyCreaturesContext } from "../../compnents/contexts/myCreaturesContext";
import { MyDiveSitesContext } from "../../compnents/contexts/myDiveSitesContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import email from "react-native-email";
import { scale } from "react-native-size-matters";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SettingsModal() {
  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { myCreatures, setMyCreatures } = useContext(MyCreaturesContext);
  const { myDiveSites, setMyDiveSites } = useContext(MyDiveSitesContext);

  const dangerZoneHeight = useSharedValue(0);
  const dangerZoneOpacity = useSharedValue(0);
  const [dangerZoneEnabled, setDangerZoneEnabled] = useState(false);

  const dangerZoneReveal = useAnimatedStyle(() => {
    return {
      height: dangerZoneHeight.value,
      opacity: dangerZoneOpacity.value,
    };
  });

  const startDangerZoneAnimations = () => {
    if (dangerZoneHeight.value === 0) {
      dangerZoneHeight.value = withSpring(80);
      dangerZoneOpacity.value = withTiming(1);
      setDangerZoneEnabled(false);
    } else {
      dangerZoneHeight.value = withTiming(0);
      dangerZoneOpacity.value = withTiming(0);
      setDangerZoneEnabled(true);
    }
  };

  const handleLogout = async () => {
    await setActiveSession(null);
    await AsyncStorage.removeItem("token");
    await signOut();
  };

  const alertHandler = async () => {
    Alert.alert(
      "You Are About To Delete Your Scuba SEAsons Account",
      "Are you sure you want to delete your account?" +
        "\n" +
        "\n" +
        "Please note that deleting your account will not delete your previous dive site or photo submissions, please contact us if you wish to have those removed from the community",
      [
        { text: "Delete My Account", onPress: () => handleAccountDelete() },
        { text: "Cancel Request", onPress: () => console.log("no tapped") },
        { text: "Contact Scuba SEAsons", onPress: () => handleEmail() },
      ]
    );
  };

  if (activeSession) {
    let first = activeSession.user.user_metadata.firstName || "";
    let last = activeSession.user.user_metadata.lastName || "";
    let blurb = `:${activeSession.user.id}`;
  }

  const handleAccountDelete = async () => {
    if (blurb) {
      await addDeletedAccountInfo({
        firstName: first,
        lastName: last,
        email: activeSession.user.email,
        UserID: activeSession.user.id,
      });

      //test me
      await deleteProfile(activeSession.user.id);
      /////

      await userDelete(activeSession.user.id);
      await setActiveSession(null);
      await AsyncStorage.removeItem("token");
      await signOut();
    }
  };

  const handleEmail = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      subject: `Delete Account Request ${blurb}`,
      body:
        "Hello I am deleting my Scuba SEAsons account and would also like to also have the following of my submissions removed as well \n \n My Dive Sites (Y/N) \n My Photo Submissions (Y/N) \n \n As removing these submisions would diminish the experience for others divers in the community, would you be willing to negotiate with Scuba SEAsons to allow these to stay in the app? (Y/N)",
      checkCanOpen: false,
    }).catch(console.error);
  };

  const [signButState, setSignButState] = useState(false);
  const [dangerButState, setDangerButState] = useState(false);

  const [diveSitesIsEnabled, setDiveSitesIsEnabled] = useState(false);
  const [creaturesIsEnabled, setCreaturesIsEnabled] = useState(false);
 
  useEffect(() => {
    
    if(myDiveSites.length > 0){
      setDiveSitesIsEnabled(true)
    }
  
    if(myCreatures.length > 0){
      setCreaturesIsEnabled(true)
    }
  }, [])
 

  const toggleDCSwitch = () =>
    setDiveSitesIsEnabled((previousState) => !previousState);
  const toggleCHSwitch = () =>
    setCreaturesIsEnabled((previousState) => !previousState);

  useEffect(() => {
    if (diveSitesIsEnabled) {
      setMyDiveSites(profile[0].UserName);
      AsyncStorage.setItem("myDiveSites", JSON.stringify(profile[0].UserName));
    } else {
      setMyDiveSites("");
      AsyncStorage.removeItem("myDiveSites");
    }
  }, [diveSitesIsEnabled]);

  useEffect(() => {
    if (creaturesIsEnabled) {
      setMyCreatures(profile[0].UserName);
      AsyncStorage.setItem("myCreatures", JSON.stringify(profile[0].UserName));
    } else {
      setMyCreatures("");
      AsyncStorage.removeItem("myCreatures");
    }
  }, [creaturesIsEnabled]);

  return (
    // <ScrollView style={{ width: "86%" }}>
    <View style={styles.container}>
      <View style={styles.first}>
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
                paddingBottom: 3,
                fontFamily: "PatrickHand_400Regular",
                color: "gold",
                fontSize: 24,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.second}>
        <View style={styles.switchBox}>
          <Text style={styles.labelText}>My Dive Sites</Text>
          <View style={styles.switches}>
          <Switch
            style={styles.switches}
            trackColor={{ false: "#767577", true: "#f4f3f4" }}
            thumbColor={diveSitesIsEnabled ? "#538bdb" : "#538bdb"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDCSwitch}
            value={diveSitesIsEnabled}
          />
          </View>
        </View>
        <View style={styles.switchBox}>
          <Text style={styles.labelText}>My Sea Creatures</Text>
          <View style={styles.switches}>
          <Switch
            trackColor={{ false: "#767577", true: "#f4f3f4" }}
            thumbColor={creaturesIsEnabled ? "#538bdb" : "#538bdb"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleCHSwitch}
            value={creaturesIsEnabled}
          />
          </View>
        </View>
      </View>

      <View style={styles.third}>
        <TouchableWithoutFeedback
          onPress={startDangerZoneAnimations}
          style={{ backgroundColor: "purple" }}
        >
          <View style={styles.dangerZonebar}>
            <AntDesign name="exclamationcircleo" size={20} color="maroon" />
            <Text style={styles.dangerText}>Danger Zone</Text>
            <AntDesign name="exclamationcircleo" size={20} color="maroon" />
          </View>
        </TouchableWithoutFeedback>

        <Animated.View style={[dangerZoneReveal, styles.dangerZone]}>
          <TouchableWithoutFeedback
            disabled={dangerZoneEnabled}
            onPressIn={() => setDangerButState(true)}
            onPressOut={() => setDangerButState(false)}
            onLongPress={alertHandler}
          >
            <View
              style={
                dangerButState
                  ? styles.deleteAccountButtonPressed
                  : styles.deleteAccountButton
              }
            >
              <Text
                style={{
                  paddingBottom: 3,
                  fontFamily: "PatrickHand_400Regular",
                  color: "maroon",
                  fontSize: 24,
                }}
              >
                Delete Account
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'green',
    height: windowHeight * 0.5,
    width: "86%",
  },
  first: {
    // position: "absolute",
    height: 50,
    // backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10%",
  },
  second: {
    height: "40%",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: "10%",
  },
  third: {
    // position: "absolute",
    height: 200,
    // backgroundColor: "yellow",
    alignItems: "center",
    // justifyContent: "center",
    marginTop: windowHeight * 0.15,
  },
  logoutButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginTop: scale(15),
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
    // marginTop: scale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  dangerZonebar: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    width: "80%",
    height: 25,
    backgroundColor: "pink",
    opacity: 0.65,
    borderRadius: 10,
    marginTop: "10%",
    paddingLeft: 5,
    paddingRight: 5,
  },
  dangerZone: {
    width: "75%",
    borderWidth: 0.5,
    marginBottom: "15%",
    borderColor: "darkgrey",
    alignSelf: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 4 : 1,
  },
  dangerText: {
    color: "maroon",
    fontFamily: "Itim_400Regular",
    fontSize: 18,
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
    zIndex: -1,
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
    zIndex: -1,
  },
  labelText: {
    color: "gold",
    alignSelf: "center",
    fontFamily: "Itim_400Regular",
    fontSize: 18,
    marginRight: 50,
    marginLeft: 5
  },
  switchBox: {
    minWidth: 250,
    flexDirection: "row",
    // backgroundColor: "green"
  },
  switches: {
    // backgroundColor: "pink",
    marginRight: 1,
    marginLeft: 35
  }
});
