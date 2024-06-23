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
import { grabRequestById } from "../../supabaseCalls/partnerSupabaseCalls";

import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { SessionContext } from "../../compnents/contexts/sessionContext";
import { MyCreaturesContext } from "../../compnents/contexts/myCreaturesContext";
import { MyDiveSitesContext } from "../../compnents/contexts/myDiveSitesContext";
import { SettingsContext } from "../../compnents/contexts/gearModalContext";
import { PartnerModalContext } from "../../compnents/contexts/partnerAccountRequestModalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import email from "react-native-email";
import { scale, moderateScale } from "react-native-size-matters";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SettingsModal() {
  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);
  const [settingsCloseState, setSettingsCloseState] = useState(false);
  const { gearModal, setGearModal } = useContext(SettingsContext);
  const { partnerModal, setPartnerModal } = useContext(
    PartnerModalContext
  );
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
  const [reqButState, setReqButState] = useState(false);
  const [dangerButState, setDangerButState] = useState(false);

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

    checkForRequest(profile[0].UserID)

  }, []);

  const checkForRequest = async(id) => {
    let returnedCheck = await grabRequestById(id)
    setRequestCheck(returnedCheck)
  }

  console.log("8", requestCheck)
  const toggleSettingsModal = () => {
    setGearModal(false);
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

  const handlePartnerButton = () => {
    setPartnerModal(true);
    setGearModal(false);
  };

  return (
    // <ScrollView style={{ width: "86%" }}>
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header}>Settings</Text>
        <View
          style={
            settingsCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableWithoutFeedback
            onPress={toggleSettingsModal}
            onPressIn={() => setSettingsCloseState(true)}
            onPressOut={() => setSettingsCloseState(false)}
            style={{
              width: scale(30),
              height: scale(30),
              alignItems: "center",
            }}
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableWithoutFeedback>
        </View>
      </View>
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
                fontFamily: "Itim_400Regular",
                color: "gold",
                fontSize: moderateScale(24),
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

      <View style={styles.partnerButton}>
        <TouchableWithoutFeedback
          onPress={requestCheck.length > 0 ? null : handlePartnerButton}
          onPressIn={() => setReqButState(true)}
          onPressOut={() => setReqButState(false)}
        >
          <View
            style={
              reqButState ? styles.logoutButtonpressed : styles.logoutButton
            }
          >
            <Text
              style={{
                paddingBottom: 3,
                fontFamily: "Itim_400Regular",
                color: requestCheck.length > 0 ? "lightgrey" : "gold",
                fontSize: moderateScale(16),
              }}
            >
              {requestCheck.length > 0 ? "Request In Progress" : "Request Partner Account"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
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

        <Animated.View style={[dangerZoneReveal, styles.dangerZone]}>
          <TouchableWithoutFeedback
            disabled={dangerZoneEnabled}
            onPressIn={() => setDangerButState(true)}
            onPressOut={() => setDangerButState(false)}
            onPress={alertHandler}
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
                  fontFamily: "Itim_400Regular",
                  color: "maroon",
                  fontSize: moderateScale(22),
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
    marginTop: "30%",
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
    // backgroundColor: "pink",
  },
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "4%",
    marginLeft: "8%",
    width: "80%",
    height: scale(40),
    // backgroundColor:"pink"
  },
  header: {
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(26),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginTop: "-1%",
    marginLeft: "7%",
    marginRight: "15%",
    // backgroundColor: "green"
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
});
