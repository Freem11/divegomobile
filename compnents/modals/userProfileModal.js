import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { TutorialLaunchPadContext } from "../contexts/tutorialLaunchPadContext";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import InsetShadow from "react-native-inset-shadow";
import { scale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { TouchableOpacity } from "react-native-gesture-handler";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UserProfileModal() {
  const { profile, setProfile } = useContext(UserProfileContext);
  const [tutorialsCloseState, setTutorialsCloseState] = useState(false);
  const [profileCloseState, setProfileCloseState] = useState(false);


  const { profileModal, setProfileModal } = useContext(
    ProfileModalContext
  );

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    // let sessionUserId = activeSession.user.id;
    let sessionUserId = 'acdc4fb2-17e4-4b0b-b4a3-2a60fdfd97dd'
    try {
      const success = await grabProfileById(sessionUserId);
      if (success) {
        setProfile(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const toggleProfileModal = () => {
    setProfileModal(false)
  }

  let username = ""
  let email = ""

  if (profile[0]){
    username = profile[0].UserName
    email = profile[0].Email
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header}>My Diver Profile</Text>
        <View
          style={
            profileCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={toggleProfileModal}
            onPressIn={() => setProfileCloseState(true)}
            onPressOut={() => setProfileCloseState(false)}
            style={{
              width: scale(30),
              height: scale(30),
              alignItems: "center",
            }}
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>

      <InsetShadow
          containerStyle={{
            borderRadius: 25,
            height: 40,
            width: 200,
            marginRight: 18,
            marginTop: 10,
          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={styles.input}
            value={username}
            placeholder={"DiverName"}
            keyboardType="numbers-and-punctuation"
            // editable={false}
            fontSize={18}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            // onChangeText={(text) =>
            //   setAddSiteVals({ ...addSiteVals, Latitude: text })
            // }
          ></TextInput>
        </InsetShadow>

        <InsetShadow
          containerStyle={{
            borderRadius: 25,
            height: 40,
            width: 200,
            marginRight: 18,
            marginTop: 10,
          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={styles.input}
            value={email}
            placeholder={"Email"}
            keyboardType="numbers-and-punctuation"
            // editable={false}
            fontSize={18}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            // onChangeText={(text) =>
            //   setAddSiteVals({ ...addSiteVals, Latitude: text })
            // }
          ></TextInput>
        </InsetShadow>
  
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    // backgroundColor: 'green',
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginBottom: "2%",
    width: "98%",
    marginLeft: 2,
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  inputContainer: {
    width: "96%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? "-20%" : "-20%",
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  text: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 5,
  },
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "2%",
    marginLeft: "12%",
    width: "80%",
    height: scale(30),
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
