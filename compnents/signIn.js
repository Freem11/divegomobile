import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "./contexts/sessionContext";
import {
  sessionCheck,
  signInStandard,
  register,
} from "../supabaseCalls/authenticateSupabaseCalls";
import { scale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import facebookLogo from "../compnents/png/facebookblue.png";
import googleLogo from "../compnents/png/google-logo-9822.png";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import config from "../config";
import Headliner from "../compnents/png/Headliner.png";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  Settings,
  LoginButton,
  AccessToken,
  Profile,
  LoginManager,
} from "react-native-fbsdk-next";

WebBrowser.maybeCompleteAuthSession();
Settings.initializeSDK();

let emailVar = false;
let passwordVar = false;

const googleWebClientId = config.WEB_CLIENT_ID;
const googleAndroidClientId = config.ANDROID_CLIENT_ID;
const googleIOSClientId = config.IOS_CLIENT_ID;
const facebookAppId = config.FACEBOOK_APP_ID;

const googleAndroidClientId2 = config.ANDROID_CLIENT_ID_2;
const googleAndroidClientId3 = config.ANDROID_CLIENT_ID_3;
const googleAndroidClientId4 = config.ANDROID_CLIENT_ID_4;

export default function SignInRoute() {
  const [token, setToken] = useState("");
  const [token2, setToken2] = useState("");

  const [FBProfile, setFBProfile] = useState({});

  const [isSignedIn, setIsSignedIn] = useState(false);

  const { activeSession, setActiveSession } = useContext(SessionContext);

  const [loginFail, setLoginFail] = useState(null);

  const [formVals, setFormVals] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [formValidation, SetFormValidation] = useState({
    email: false,
    password: false,
    firstName: "",
    lastName: "",
  });

  Platform.OS === "ios"
    ? GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/userinfo.profile"], 
        iosClientId: googleIOSClientId, 
      })
    : GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/userinfo.profile"], 
        webClientId: googleWebClientId, 
      });

  googleSignIn = async () => {
    try {
      setIsSignedIn(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      handleOAuthSubmit(userInfo.user);
    } catch (error) {
      setIsSignedIn(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert("canned");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert("stuck");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert("no Gp service");
      } else {
        alert(error);
      }
    }
  };

  facebookSignIn = async () => {
    setIsSignedIn(true);

    LoginManager.logInWithPermissions(["public_profile"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          const facebookProfile = Profile.getCurrentProfile().then(function (
            currentProfile
          ) {
            if (currentProfile) {
              handleOAuthSubmit(currentProfile);
              LoginManager.logOut();
            }
          });
        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
      }
    );
  };

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   androidClientId: googleAndroidClientId,
  //   iosClientId: googleIOSClientId,
  // });

  // const [request2, response2, promptAsync2] = Facebook.useAuthRequest({
  //   clientId: facebookAppId,
  // });

  const handleOAuthSubmit = async (user) => {
    let Fname;
    let Lname;
    let Pword;

    if (user.name) {
      Fname = user.name.split(" ").slice(0, 1);
      Lname = user.name.split(" ").slice(-1);
    }

    if(user.userID) {
      Pword = user.userID;
    } else if(user.id) {
      Pword = user.id;
    }

    let MailE = user.email;

    let accessToken = await OAuthSignIn({
      password: Pword,
      email: MailE,
      firstName: Fname,
      lastName: Lname,
    });
  };

  async function OAuthSignIn(formVals) {
    let accessToken = await signInStandard(formVals);
    if (accessToken) {
      await AsyncStorage.setItem("token", JSON.stringify(accessToken));
      setActiveSession(accessToken);
      setIsSignedIn(false);
    } else {
      let registrationToken = await register(formVals);
      if (registrationToken.session !== null) {
        await AsyncStorage.setItem("token", JSON.stringify(registrationToken));
        setActiveSession(registrationToken);
        setIsSignedIn(false);
      } else {
        setIsSignedIn(false);
        setLoginFail("You already have an account with this email");
      }
    }
  }

  // useEffect(() => {
  //   handleGEffect();
  // }, [response, token]);

  // useEffect(() => {
  //   handleFEffect();
  // }, [response2, token2]);

  async function handleGEffect() {
    if (response?.type === "success") {
      getGoogleUserData(response.authentication.accessToken);
    }
  }

  async function handleFEffect() {
    if (response2?.type === "success") {
      getFacebokUserData(response2.authentication.accessToken);
    }
  }

  // const handleGAsync = async () => {
  //   setIsSignedIn(true)
  //   await promptAsync({ showInRecents: true, useProxy: false });
  // };

  // const handleFAsync = async () => {
  //   setIsSignedIn(true)
  //   await promptAsync2();
  // };

  async function getFacebokUserData(tokenF) {
    if (!tokenF) return;

    try {
      const res2 = await fetch(
        `https://graph.facebook.com/me?access_token=${tokenF}&fields=id,name,email`
      );
      const user2 = await res2.json();
      handleOAuthSubmit(user2);
    } catch (err) {
      console.log("error", err);
    }
  }

  async function getGoogleUserData(tokenG) {
    if (!tokenG) return;
    try {
      const res = await fetch(`https://www.googleapis.com/userinfo/v2/me`, {
        headers: { Authorization: `Bearer ${tokenG}` },
      });
      const user = await res.json();
      handleOAuthSubmit(user);
    } catch (err) {
      console.log("error", err);
    }
  }

  const handleSignInSubmit = async () => {
    if (formVals.email === "" || formVals.email === null) {
      emailVar = true;
    } else {
      emailVar = false;
    }

    if (formVals.password === "" || formVals.password === null) {
      passwordVar = true;
    } else {
      passwordVar = false;
    }

    SetFormValidation({
      ...formValidation,
      emailVal: emailVar,
      passwordVal: passwordVar,
    });

    if (formVals.email === "" || formVals.password == "") {
      setLoginFail("Please fill out both email and password");
      return;
    } else {
      let accessToken = await signInStandard(formVals);
      if (accessToken) {
        await AsyncStorage.setItem("token", JSON.stringify(accessToken));
        setActiveSession(accessToken);
      } else {
        setLoginFail("The credentials you supplied are not valid");
        return;
      }
      let checker = await sessionCheck();
      //  console.log("checkerbox", checker)
    }
  };

  const keboardOffset = Platform.OS === "ios" ? 100 : 0;

  return (
    <View style={styles.container}>
      <Image source={Headliner} style={[styles.Headliner]} />

      <View style={{ marginTop: Platform.OS ==="ios" ? "10%" :"15%", marginLeft: "-2%" }}>
 
        <TouchableWithoutFeedback
          onPress={googleSignIn}
          // onPress={handleGAsync}
          disabled={isSignedIn}
        >
          <View style={[styles.SignUpWithGoogle]}>
            <Image source={googleLogo} style={[styles.gLogo]} />
            <Text
              style={{
                color: "#2d2d2d",
                fontFamily: "Roboto_700Bold",
                fontWeight: "bold",
                fontSize: 14,
                opacity: 0.8,
              }}
            >
              Sign in with Google
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          // onPress={handleFAsync}
          onPress={facebookSignIn}
          disabled={isSignedIn}
        >
          <View style={[styles.SignUpWithFacebook]}>
            <Image source={facebookLogo} style={[styles.fbLogo]} />
            <Text
              style={{
                marginLeft: scale(5),
                color: "#FFFFFF",
                fontFamily: "Roboto_700Bold",
                fontWeight: "bold",
                fontSize: 14,
                opacity: 1,
              }}
            >
              Sign in with Facebook
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keboardOffset}
      >
        <View style={styles.inputContainer}>
          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 10,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.5}
          >
            <TextInput
              style={formValidation.emailVal ? styles.inputRed : styles.input}
              value={formVals.email}
              placeholder={"Email"}
              placeholderTextColor="darkgrey"
              color="#F0EEEB"
              fontSize={18}
              onChangeText={(emailsText) =>
                setFormVals({ ...formVals, email: emailsText })
              }
              onFocus={() => setLoginFail(null)}
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 10,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.5}
          >
            <TextInput
              style={
                formValidation.passwordVal ? styles.inputRed : styles.input
              }
              value={formVals.password}
              placeholder={"Password"}
              fontSize={18}
              secureTextEntry={true}
              placeholderTextColor="darkgrey"
              color="#F0EEEB"
              onChangeText={(passwordsText) =>
                setFormVals({ ...formVals, password: passwordsText })
              }
              onFocus={() => setLoginFail(null)}
            ></TextInput>
          </InsetShadow>
          {loginFail && <Text style={styles.erroMsg}>{loginFail}</Text>}
        </View>
      </KeyboardAvoidingView>

      <View style={styles.SubmitButton2}>
        <TouchableWithoutFeedback onPress={handleSignInSubmit}>
          <Text
            style={{
              color: "gold",
              fontSize: 17,
              marginTop: 8,
              fontFamily: "PermanentMarker_400Regular",
              width: "100%",
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            Sign In
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538dbd",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(10),
  },
  input: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "#538dbd",
    borderRadius: 10,
    width: scale(200),
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 10,
  },
  inputRed: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: scale(200),
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 10,
  },
  text: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 5,
  },
  SubmitButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: "3%",
    marginLeft: 70,
    borderWidth: 0.3,
    zIndex: 2,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
  },
  SubmitButton2: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: "3%",
    marginLeft: 70,
    borderWidth: 0.3,
    zIndex: 2,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
  },
  singups: {
    marginTop: "25%",
    marginBottom: "-23%",
  },
  SignUpWithGoogle: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
    height: 30,
    width: 200,
    marginTop: scale(0),
    margin: 10,
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,

    elevation: 10,
  },
  SignUpWithFacebook: {
    backgroundColor: "#0165E1",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 2,
    height: 30,
    width: 200,
    marginTop: scale(5),
    margin: 10,
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,

    elevation: 1,
  },
  fbLogo: {
    backgroundColor: "white",
    borderRadius: 16/2,
    height: 18,
    width: 18,
    opacity: 1,
    marginRight: Platform.OS ==="ios" ? 2 : 8,
    marginLeft: 10
  },
  gLogo: {
    height: 24,
    width: 24,
    opacity: 1,
    marginRight: 12,
    marginLeft: 7
  },
  erroMsg: {
    margin: 5,
    padding: 7,
    color: "pink",
    fontFamily: "IndieFlower_400Regular",
    borderStyle: "dashed",
    borderRadius: 10,
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: scale(10),
  },
  Headliner: {
    height: scale(250),
    width: "100%",
    marginLeft: "-3%",
    marginTop: Platform.OS === "ios" ? "-10%" :"-20%",
  },
});
