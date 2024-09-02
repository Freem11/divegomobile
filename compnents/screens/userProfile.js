import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView } from "react-native";
import WavyHeaderDynamic from "./wavyHeaderDynamic";
import PlainTextInput from "./plaintextInput";
import {
  activeFonts,
  colors,
  primaryButton,
  primaryButtonAlt,
  buttonText,
  buttonTextAlt,
} from "../styles";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UserProfile(props) {
  const {} = props;
  const { profile } = useContext(UserProfileContext);
  let defaultState = profile[0];
  const [profileVals, setProfileVals] = useState({ defaultState });
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  //profile photo : profile.profilePhoto
  //profile name : profile.UserName
  //profile photo : profile.profileBio

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={{marginLeft: "-50%", marginBottom: windowHeight/20}}>
          <PlainTextInput
            content={profile[0].UserName}
            isEditModeOn={isEditModeOn}
            setIsEditModeOn={setIsEditModeOn}
            onChangeText={(text) =>
              setProfileVals({ ...profileVals, UserName: text })
            }
          />
        </View>

        <PlainTextInput
          content={profile[0].profileBio}
          isEditModeOn={isEditModeOn}
          setIsEditModeOn={setIsEditModeOn}
          onChangeText={(text) =>
            setProfileVals({ ...profileVals, profileBio: text })
          }
        />
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
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
    position: "absolute",
    top: 0,
    left: 0,
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
  SignUpWithFacebook: {
    backgroundColor: "#1877F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(25),
    height: moderateScale(48),
    width: moderateScale(48),
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: moderateScale(1),
      height: moderateScale(1),
    },
    shadowOpacity: 1,
    shadowRadius: moderateScale(2),

    elevation: 10,
  },
  SignUpWithGoogle: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(25),
    height: moderateScale(48),
    width: moderateScale(48),
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: moderateScale(1),
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(1),
    shadowRadius: moderateScale(2),

    elevation: 10,
  },
  appleButton: {
    backgroundColor: "white",
    borderRadius: moderateScale(25),
    height: moderateScale(48),
    width: moderateScale(48),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: moderateScale(6),
    shadowOffset: {
      width: moderateScale(1),
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(1),
    shadowRadius: moderateScale(2),

    elevation: 10,
  },
  appleLogo: {
    // backgroundColor: "white",
    borderRadius: 50 / 2,
    height: moderateScale(50),
    width: moderateScale(50),
    opacity: 1,
    // marginRight: -2,
    // marginLeft: 10,
  },
  fbLogo: {
    // backgroundColor: "white",
    borderRadius: 22 / 2,
    height: moderateScale(45),
    width: moderateScale(45),
    opacity: 1,
    // marginRight: -2,
    // marginLeft: 10,
  },
  gLogo: {
    marginTop: moderateScale(2),
    marginRight: moderateScale(5),
    height: moderateScale(62),
    width: moderateScale(62),
    opacity: 1,
    // marginRight: 2,
    // marginLeft: 7,
  },
});
