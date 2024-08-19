import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "./contexts/sessionContext";
import {
  sessionCheck,
  signInStandard,
  register,
} from "../supabaseCalls/authenticateSupabaseCalls";
import { createProfile } from "../supabaseCalls/accountSupabaseCalls";
import { scale, moderateScale } from "react-native-size-matters";
import facebookLogo from "../compnents/png/loginIcons/facebookblue.png";
import googleLogo from "../compnents/png/loginIcons/google-logo-9822.png";
import mantaIOS from "../compnents/png/loginIcons/Matt_Manta_White.png";
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
import * as AppleAuthentication from "expo-apple-authentication";
import { Buffer } from "buffer";
import SubmitButton from "./reusables/submitButton";
import InputField from "./reusables/textInputs";
Settings.initializeSDK();

let emailVar = false;
let passwordVar = false;

const googleWebClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const googleIOSClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const googleAndroidClientId = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;
const googleAndroidClientId2 = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID_2;
const googleAndroidClientId3 = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID_3;
const googleAndroidClientId4 = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID_4;

const facebookAppId = process.env.FACEBOOK_APP_ID;

const windowWidth = Dimensions.get("window").width;

export default function SignInRoute() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { setActiveSession } = useContext(SessionContext);
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

  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {
    const checkApple = async () => {
      const isApple = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isApple);

      let appleCore = JSON.parse(await AsyncStorage.getItem("appleCreds"));
    };
    checkApple();
  }, []);

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = Buffer.from(base64, "base64").toString("ascii");
    return JSON.parse(jsonPayload);
  }

  const getAppleAuth = () => {
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.appleButton}
        onPress={appleLogin}
        disabled={isSignedIn}
      />
    );
  };

  const appleLogin = async () => {
    setIsSignedIn(true);
    try {
      const creds = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const decoded = parseJwt(creds.identityToken);
      if (
        (creds.email !== null) &
        (creds.fullName.familyName !== null) &
        (creds.fullName.givenName !== null)
      ) {
        let appleObject = {
          name: `${creds.fullName.givenName} ${creds.fullName.familyName}`,
          email: creds.email,
          id: creds.user,
        };
        // await AsyncStorage.setItem("appleCreds", JSON.stringify(appleObject));
        handleOAuthSubmit(appleObject);
        setIsSignedIn(false);
      } else {
        let reUsedApple = {
          email: decoded.email,
          id: decoded.sub,
        };
        handleOAuthSubmit(reUsedApple);
        // let reUsedApple = JSON.parse(await AsyncStorage.getItem("appleCreds"));
        // if (reUsedApple && reUsedApple.email === decoded.email) {
        //   handleOAuthSubmit(reUsedApple);
        //   setIsSignedIn(false);
        // } else {
        //   setIsSignedIn(false);
        //   setLoginFail("Invalid Credentials (email and name required for sign in)");
        // }
      }
    } catch (e) {
      console.log(e);
    }
  };

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
        console.log("Login cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Login stuck");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Login no google play services");
      } else {
        console.log(error);
      }
    }
  };

  facebookSignIn = async () => {
    setIsSignedIn(true);
    LoginManager.logInWithPermissions(["public_profile"]).then(function (
      result
    ) {
      if (result.isCancelled) {
        setIsSignedIn(false);
        console.log("Login cancelled");
      } else {
        AccessToken.getCurrentAccessToken().then((data) => {
          getFacebokUserData(data.accessToken);
        });
      }
    });
  };

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

  const handleOAuthSubmit = async (user) => {
    let Fname;
    let Lname;
    let Pword;
    let MailE = user.email;

    if (user.name) {
      Fname = user.name.split(" ").slice(0, 1);
      Lname = user.name.split(" ").slice(-1);
    }

    if (user.userID) {
      Pword = user.userID;
    } else if (user.id) {
      Pword = user.id;
    }

    let accessToken = await OAuthSignIn({
      password: Pword,
      email: MailE,
      firstName: Fname,
      lastName: Lname,
    });
  };

  async function OAuthSignIn(formVals) {
    LoginManager.logOut();
    let accessToken = await signInStandard(formVals);
    if (accessToken) {
      await AsyncStorage.setItem("token", JSON.stringify(accessToken));
      setActiveSession(accessToken.session);
      // console.log("at oauth", accessToken)
      setIsSignedIn(false);
    } else {
      let registrationToken = await register(formVals);
      if (registrationToken.session !== null) {
        //test me
        await createProfile({
          id: registrationToken.session.user.id,
          email: formVals.email,
        });
        ////
        await AsyncStorage.setItem("token", JSON.stringify(registrationToken));
        setActiveSession(registrationToken.session);
        // console.log("at oauth reg", registrationToken)
        setIsSignedIn(false);
      } else {
        setIsSignedIn(false);
        setLoginFail("You already have an account with this email");
      }
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
        setActiveSession(accessToken.session);
        // console.log("sign in reg", accessToken)
      } else {
        setLoginFail("The credentials you supplied are not valid");
        return;
      }
      let checker = await sessionCheck();
      //  console.log("checkerbox", checker)
    }
  };

  const keboardOffset = Platform.OS === "ios" ? 100 : 0;
  const [googleButState, setGoogleButState] = useState(false);
  const [facebookState, setFacebookButState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.Headliner}>
        <Image source={mantaIOS} style={styles.manta} />
        <Text
          style={{
            fontFamily: "Caveat_400Regular",
            fontSize: scale(25),
            color: "white",
          }}
        >
          Scuba SEAsons
        </Text>
      </View>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? scale(35) : scale(35),
          marginBottom: scale(20),
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback
          onPress={googleSignIn}
          onPressIn={() => setGoogleButState(true)}
          onPressOut={() => setGoogleButState(false)}
          disabled={isSignedIn}
        >
          <View
            style={
              googleButState
                ? styles.SignUpWithGooglePressed
                : styles.SignUpWithGoogle
            }
          >
            <Image source={googleLogo} style={[styles.gLogo]} />
            <Text
              style={{
                color: googleButState ? "#ffffff" : "#2d2d2d",
                fontFamily: "Roboto_700Bold",
                fontWeight: "bold",
                fontSize: moderateScale(12),
                opacity: 0.8,
                marginLeft: scale(0),
              }}
            >
              Sign in with Google
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={facebookSignIn}
          onPressIn={() => setFacebookButState(true)}
          onPressOut={() => setFacebookButState(false)}
          disabled={isSignedIn}
        >
          <View
            style={
              facebookState
                ? styles.SignUpWithFacebookPressed
                : styles.SignUpWithFacebook
            }
          >
            <Image source={facebookLogo} style={[styles.fbLogo]} />
            <Text
              style={{
                marginLeft: windowWidth > 600 ? scale(5) : scale(10),
                color: "#FFFFFF",
                fontFamily: "Roboto_700Bold",
                fontWeight: "bold",
                fontSize: moderateScale(12),
                opacity: 1,
              }}
            >
              Sign in with Facebook
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {appleAuthAvailable ? getAppleAuth() : null}
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: windowWidth > 700 ? moderateScale(0) : moderateScale(20),
          marginBottom:
            windowWidth > 700 ? moderateScale(20) : moderateScale(10),
        }}
      >
        <View style={styles.leftLine}></View>
        <Text style={styles.orTag}>or</Text>
        <View style={styles.leftLine}></View>
        <View></View>
      </View>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keboardOffset}
      >
        <View style={styles.inputContainer}>
          <InputField
            validationItem={formValidation.emailVal}
            placeHolderText={"Email"}
            inputValue={formVals.email}
            keyboardType={"default"}
            onChangeText={(text) => setFormVals({ ...formVals, email: text })}
          />
          <View style={styles.inputBox}>
            <InputField
              validationItem={formValidation.passwordVal}
              placeHolderText={"Password"}
              inputValue={formVals.password}
              keyboardType={null}
              onChangeText={(text) =>
                setFormVals({ ...formVals, password: text })
              }
              secure={true}
            />
          </View>

          {loginFail && <Text style={styles.erroMsg}>{loginFail}</Text>}
        </View>
      </KeyboardAvoidingView>

      <SubmitButton buttonAction={handleSignInSubmit} label={"Sign In"} />
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
    // backgroundColor: "pink",
    marginTop: windowWidth > 700 ? moderateScale(0) : moderateScale(20),
  },
  inputBox: {
    marginTop: moderateScale(10),
  },
  SignUpWithGoogle: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(2),
    height: moderateScale(30),
    width: moderateScale(200),
    marginTop: moderateScale(0),
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: moderateScale(1),
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(1),
    shadowRadius: moderateScale(2),

    elevation: 10,
  },
  SignUpWithGooglePressed: {
    backgroundColor: "#2d2d2d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(2),
    height: moderateScale(30),
    width: moderateScale(200),
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: moderateScale(1),
      height: moderateScale(1),
    },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(2),

    elevation: 10,
  },
  SignUpWithFacebook: {
    backgroundColor: "#0165E1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(2),
    height: moderateScale(30),
    width: moderateScale(200),
    marginTop: Platform.OS === "ios" ? moderateScale(10) : scale(10),
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: moderateScale(1),
      height: moderateScale(1),
    },
    shadowOpacity: 1,
    shadowRadius: moderateScale(2),

    elevation: 10,
  },
  SignUpWithFacebookPressed: {
    backgroundColor: "#4267b2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(2),
    height: moderateScale(30),
    width: moderateScale(200),
    marginTop: Platform.OS === "ios" ? moderateScale(10) : scale(10),
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: moderateScale(1),
      height: moderateScale(1),
    },
    shadowOpacity: 1,
    shadowRadius: moderateScale(2),

    elevation: 10,
  },
  fbLogo: {
    backgroundColor: "white",
    borderRadius: windowWidth > 600 ? 24 / 2 : 16 / 2,
    height: windowWidth > 600 ? scale(8) : scale(16),
    width: windowWidth > 600 ? scale(8) : scale(16),
    opacity: 1,
    marginRight: -2,
    // marginLeft: 10,
  },
  gLogo: {
    height: windowWidth > 600 ? scale(10) : scale(20),
    width: windowWidth > 600 ? scale(10) : scale(20),
    opacity: 1,
    marginRight: 2,
    // marginLeft: 7,
  },
  erroMsg: {
    margin: 5,
    padding: 7,
    color: "pink",
    fontFamily: "Itim_400Regular",
    borderStyle: "dashed",
    borderRadius: 10,
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: scale(10),
    alignSelf: "center",
  },
  Headliner: {
    height: "20%",
    width: "50%",
    marginTop: windowWidth > 700 ? moderateScale(-10) : moderateScale(-40),
    marginBottom: windowWidth > 700 ? moderateScale(30) : moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  manta: {
    //  backgroundColor: "pink",
    height: scale(110),
    width: scale(90),
    marginBottom: scale(5),
  },
  appleButton: {
    width: moderateScale(201),
    height: moderateScale(32),
    alignSelf: "center",
    marginTop: moderateScale(9),
    marginBottom: scale(0),
    shadowColor: "#2d2d2d",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,

    elevation: 1,
  },
  orTag: {
    color: "white",
    fontFamily: "Itim_400Regular",
    fontSize: scale(20),
    marginLeft: "10%",
    marginRight: "10%",
  },
  leftLine: {
    height: 1,
    width: scale(100),
    backgroundColor: "white",
    marginTop: "4%",
  },
});
