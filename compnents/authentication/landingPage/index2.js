import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import WavyHeader from "../../wavyHeader";
import {
  activeFonts,
  colors,
  fontSizes,
  primaryButton,
  primaryButtonAlt,
  buttonText,
  buttonTextAlt,
} from "../../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleLogo from "../../png/loginIcons/apple.png";
import facebookLogo from "../../png/loginIcons/facebook.png";
import googleLogo from "../../png/loginIcons/google.png";
import { appleLogin, googleSignIn, facebookSignIn } from "../../helpers/loginHelpers";
import { moderateScale } from "react-native-size-matters";
import { SessionContext } from "../../contexts/sessionContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const googleWebClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const googleIOSClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

export default function LandingPage(props) {
  const {
    title,
    loginButton,
    registerButton,
    content,
    moveToLoginPage,
    moveToSignUpPage,
  } = props;
  const { activeSession, setActiveSession } = useContext(SessionContext);

  Platform.OS === "ios"
    ? GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
      iosClientId: googleIOSClientId,
    })
    : GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
      webClientId: googleWebClientId,
    });

  const [googleData, setGoogleData] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {
    const checkApple = async () => {
      const isApple = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isApple);

      let appleCore = JSON.parse(await AsyncStorage.getItem("appleCreds"));
    };
    checkApple();
  }, []);

  const getAppleAuth = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => appleLogin(setActiveSession, setIsSignedIn)}
        disabled={isSignedIn}
      >
        <View style={styles.appleButton}>
          <Image source={appleLogo} style={styles.appleLogo} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEnabled={false}
        style={styles.contentContainer}
        contentContainerStyle={styles.contentScroll}
      >
        <Text style={styles.header}>{title}</Text>

        <TouchableWithoutFeedback onPress={() => moveToLoginPage()}>
          <View style={styles.loginButton}>
            <Text style={styles.loginText}>{loginButton}</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => moveToSignUpPage()}>
          <View style={styles.registerButton}>
            <Text style={styles.registerText}>{registerButton}</Text>
          </View>
        </TouchableWithoutFeedback>

        <Text style={styles.social}>{content}</Text>
        <View
          style={{
            width: moderateScale(240),
            marginTop: windowHeight / 30,
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
            // backgroundColor: 'pink'
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => googleSignIn(setActiveSession, setIsSignedIn)}
            disabled={isSignedIn}
          >
            <View style={styles.SignUpWithGoogle}>
              <Image source={googleLogo} style={[styles.gLogo]} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => facebookSignIn(setActiveSession, setIsSignedIn)}
            disabled={isSignedIn}
          >
            <View style={styles.SignUpWithFacebook}>
              <Image source={facebookLogo} style={[styles.fbLogo]} />
            </View>
          </TouchableWithoutFeedback>

          {appleAuthAvailable ? getAppleAuth() : null}
        </View>
      </ScrollView>
      <WavyHeader customStyles={styles.svgCurve}></WavyHeader>
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
    zIndex: 15,
    position: "absolute",
    top: 0,
    left: 0,
    height: windowHeight,
    width: "100%",
    // backgroundColor: "pink"
  },
  contentScroll: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink",
  },
  header: {
    zIndex: 10,
    marginTop: windowWidth > 600 ? windowHeight / 2.5 : moderateScale(windowHeight / 3.2),
    marginRight: windowWidth / 3,
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Regular,
    color: colors.themeBlack,
  },
  social: {
    zIndex: 10,
    marginTop: windowHeight / 20,
    fontSize: moderateScale(fontSizes.StandardText),
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
