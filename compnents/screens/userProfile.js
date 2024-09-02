import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Dimensions, Text, ScrollView } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import WavyHeaderDynamic from "./wavyHeaderDynamic";
import PlainTextInput from "./plaintextInput";
import {
  activeFonts,
  colors,
  fontSizes,
  primaryButton,
  primaryButtonAlt,
  buttonText,
  buttonTextAlt,
} from "../styles";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UserProfile(props) {
  const {} = props;
  const { profile } = useContext(UserProfileContext);
  const [userFail, setUserFail] = useState("");
  const [profileVals, setProfileVals] = useState(null);
  const [tempUserName, setTempUserName] = useState("");
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  useEffect(() => {
    setProfileVals({
      id: profile[0].UserID,
      userName: profile[0].UserName,
      bio: profile[0].profileBio,
      photo: profile[0].profilePhoto,
    });
    setTempUserName(profile[0].UserName)
  }, []);

  useEffect(() => {
    setUserFail("")

    if (!isEditModeOn && profileVals) {
      profileUpdate();
    }
  }, [isEditModeOn]);

  const profileUpdate = async () => {
    if (profileVals.userName === "") {
      setUserFail("Your diver name cannot be blank!");
      setProfileVals({...profileVals, userName: tempUserName})
    } else {
      try {
        const success = await updateProfile({
          id: profileVals.id,
          username: profileVals.userName,
          bio: profileVals.bio,
        });
        if (success[0].length === 0 && profileVals) {
          setProfileVals({ ...profileVals, userName: tempUserName });
          setUserFail("Sorry that diver name has already been taken");
        }
      } catch (e) {
        setProfileVals({ ...profileVals, userName: tempUserName });
        setUserFail("Sorry that diver name has already been taken");
        console.log({ title: "Error19", message: e.message });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={{ marginBottom: windowHeight / 70 }}>
        {profileVals && <PlainTextInput
            content={profileVals.userName}
            fontSz={fontSizes.Header}
            isEditModeOn={isEditModeOn}
            setIsEditModeOn={setIsEditModeOn}
            onChangeText={(nameText) =>
              setProfileVals({ ...profileVals, userName: nameText })
            }
          />}

          {userFail.length > 0 ? (
            <Text style={styles.erroMsg}>{userFail}</Text>
          ) : (
            <View style={styles.erroMsgEmpty}></View>
          )}

        </View>
        <MaskedView
          maskElement={
            <LinearGradient
              style={{ flex: 1 }}
              colors={["white", "transparent"]}
              start={{ x: 0.5, y: 0.7 }}
            ></LinearGradient>
          }
        >
          <View style={styles.scrollViewBox}>
            <ScrollView>
            {profileVals && <PlainTextInput
                content={profileVals.bio}
                fontSz={fontSizes.StandardText}
                isEditModeOn={isEditModeOn}
                setIsEditModeOn={setIsEditModeOn}
                onChangeText={(bioText) =>
                  setProfileVals({ ...profileVals, bio: bioText })
                }
              />}
            </ScrollView>
          </View>
        </MaskedView>
      </View>

      <WavyHeaderDynamic customStyles={styles.svgCurve}></WavyHeaderDynamic>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "left",
    zIndex: 15,
    position: "absolute",
    top: 0,
    left: 0,
    marginTop: windowHeight / 2.4,
    height: windowHeight,
    width: "100%",
    // backgroundColor: "pink"
  },
  header: {
    zIndex: 10,
    marginTop:
      windowWidth > 600
        ? windowHeight / 2.5
        : moderateScale(windowHeight / 3.2),
    marginRight: windowWidth / 3,
    fontSize: moderateScale(34),
    fontFamily: activeFonts.Regular,
    color: colors.themeBlack,
  },
  scrollViewBox: {
    height: windowHeight / 3.5,
    // backgroundColor: 'pink'
  },
  social: {
    zIndex: 10,
    marginTop: windowHeight / 20,
    fontSize: moderateScale(18),
    fontFamily: activeFonts.ThinItalic,
    color: colors.themeBlack,
  },
  loginButton: [primaryButton, { marginTop: windowHeight / 20 }],
  registerButton: [primaryButtonAlt, { marginTop: windowHeight / 50 }],
  loginText: buttonText,
  registerText: buttonTextAlt,
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
  erroMsg: {
    minHeight: moderateScale(34),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
    marginHorizontal: "10%",
    marginTop: "1%"
  },
  erroMsgEmpty: {
    // height: moderateScale(34),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
    marginHorizontal: "10%",
    marginTop: "1%"
  },
});
