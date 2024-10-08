import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Platform,
  Alert,
  Dimensions,
  Switch,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
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
import { grabRequestById } from "../../supabaseCalls/partnerSupabaseCalls";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { SessionContext } from "../../compnents/contexts/sessionContext";
import { MyCreaturesContext } from "../../compnents/contexts/myCreaturesContext";
import { MyDiveSitesContext } from "../../compnents/contexts/myDiveSitesContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import email from "react-native-email";
import { moderateScale } from "react-native-size-matters";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SettingsModal() {

  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { profile } = useContext(UserProfileContext);
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
      dangerZoneHeight.value = withSpring(moderateScale(80));
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
    let blurb = `:${activeSession.user.id}` || null;
  }

  const handleAccountDelete = async () => {
    if (blurb) {
      await addDeletedAccountInfo({
        firstName: first,
        lastName: last,
        email: activeSession.user.email,
        UserID: activeSession.user.id,
      });

      await deleteProfile(activeSession.user.id);
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
      body: "Hello I am deleting my Scuba SEAsons account and would also like to also have the following of my submissions removed as well \n \n My Dive Sites (Y/N) \n My Photo Submissions (Y/N) \n \n As removing these submisions would diminish the experience for others divers in the community, would you be willing to negotiate with Scuba SEAsons to allow these to stay in the app? (Y/N)",
      checkCanOpen: false,
    }).catch(console.error);
  };

  const [diveSitesIsEnabled, setDiveSitesIsEnabled] = useState(false);
  const [creaturesIsEnabled, setCreaturesIsEnabled] = useState(false);
  const [requestCheck, setRequestCheck] = useState([]);

  useEffect(() => {
    if (myDiveSites.length > 0) {
      setDiveSitesIsEnabled(true);
    }

    if (myCreatures.length > 0) {
      setCreaturesIsEnabled(true);
    }
    if (profile[0]) {
      checkForRequest(profile[0].UserID);
    }
  }, []);

  const checkForRequest = async (id) => {
    let returnedCheck = await grabRequestById(id);
    setRequestCheck(returnedCheck);
  };


  const toggleDCSwitch = () =>
    setDiveSitesIsEnabled((previousState) => !previousState);
  const toggleCHSwitch = () =>
    setCreaturesIsEnabled((previousState) => !previousState);

  useEffect(() => {
    if (diveSitesIsEnabled) {
      setMyDiveSites(profile[0].UserID);
      AsyncStorage.setItem("myDiveSites", JSON.stringify(profile[0].UserID));
    } else {
      setMyDiveSites("");
      AsyncStorage.removeItem("myDiveSites");
    }
  }, [diveSitesIsEnabled]);

  useEffect(() => {
    if (creaturesIsEnabled) {
      setMyCreatures(profile[0].UserID);
      AsyncStorage.setItem("myCreatures", JSON.stringify(profile[0].UserID));
    } else {
      setMyCreatures("");
      AsyncStorage.removeItem("myCreatures");
    }
  }, [creaturesIsEnabled]);

  return (
    // <ScrollView style={{ width: "86%" }}>
    <View style={styles.container}>
  

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
              // style={styles.switches}
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
            <AntDesign
              name="exclamationcircleo"
              size={moderateScale(20)}
              color="maroon"
            />
            <Text style={styles.dangerText}>Danger Zone</Text>
            <AntDesign
              name="exclamationcircleo"
              size={moderateScale(20)}
              color="maroon"
            />
          </View>
        </TouchableWithoutFeedback>

  
      </View>
    </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'green',
    height: windowHeight * 0.5,
    width: "100%",
  },
  first: {
    height: 50,
    // backgroundColor: "pink",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15%",
  },
  second: {
    height: "40%",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: "10%",
  },
  partnerButton: {
    // backgroundColor: "yellow",
    alignItems: "center",
  },
  third: {
    height: moderateScale(200),
    alignItems: "center",
    marginTop: windowWidth > 700 ? moderateScale(30) : moderateScale(160),
  },
  logoutButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
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
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
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
    height: moderateScale(25),
    backgroundColor: "pink",
    opacity: 0.65,
    borderRadius: moderateScale(10),
    marginTop: "10%",
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(10),
  },
  dangerZone: {
    width: "75%",
    height: moderateScale(75),
    borderWidth: 0.5,
    marginBottom: moderateScale(100),
    borderColor: "darkgrey",
    alignSelf: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 4 : 1,
  },
  dangerText: {
    color: "maroon",
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(18),
  },
  deleteAccountButton: {
    backgroundColor: "pink",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: moderateScale(20),
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
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
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
    fontSize: moderateScale(18),
    marginRight: moderateScale(50),
    marginLeft: moderateScale(5),
  },
  switchBox: {
    minWidth: moderateScale(250),
    flexDirection: "row",
    // backgroundColor: "green"
  },
  switches: {
    // backgroundColor: "pink",
    marginRight: moderateScale(1),
    marginLeft: moderateScale(35),
  },
});
