import {
  AccessToken,
  LoginManager,
} from "react-native-fbsdk-next";
import * as AppleAuthentication from "expo-apple-authentication";
import { Buffer } from "buffer";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  sessionCheck,
  signInStandard,
  register,
} from "../supabaseCalls/authenticateSupabaseCalls";
import { createProfile } from "../supabaseCalls/accountSupabaseCalls";

//Sign Ins
export const facebookSignIn = async (setActiveSession, setIsSignedIn) => {
  setIsSignedIn(true);
  LoginManager.logInWithPermissions(["public_profile"]).then(function (result) {
    if (result.isCancelled) {
      setIsSignedIn(false);
      console.log("Login cancelled");
    } else {
      AccessToken.getCurrentAccessToken().then((data) => {
        getFacebokUserData(data.accessToken, setActiveSession, setIsSignedIn);
      });
    }
  });
};

export const googleSignIn = async (setActiveSession, setIsSignedIn) => {
  try {
    setIsSignedIn(true);
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    handleOAuthSubmit(userInfo.user, setActiveSession, setIsSignedIn);
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

export const appleLogin = async (setActiveSession, setIsSignedIn) => {
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
      handleOAuthSubmit(appleObject, setActiveSession, setIsSignedIn);
      setIsSignedIn(false);
    } else {
        let reUsedApple = {
            email: decoded.email,
            id: decoded.sub,
          };
          console.log("reUsedApple", reUsedApple)
          handleOAuthSubmit(reUsedApple, setActiveSession, setIsSignedIn);
    }
  } catch (e) {
    console.log(e);
  }
};

// Get User Data
async function getFacebokUserData(tokenF, setActiveSession, setIsSignedIn) {
  if (!tokenF) return;

  try {
    const res2 = await fetch(
      `https://graph.facebook.com/me?access_token=${tokenF}&fields=id,name,email`
    );
    const user2 = await res2.json();
    handleOAuthSubmit(user2, setActiveSession, setIsSignedIn);
  } catch (err) {
    console.log("error", err);
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = Buffer.from(base64, "base64").toString("ascii");
  return JSON.parse(jsonPayload);
}

const handleOAuthSubmit = async (user, setActiveSession, setIsSignedIn) => {
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

  let accessToken = await OAuthSignIn(
    {
      password: Pword,
      email: MailE,
      firstName: Fname,
      lastName: Lname,
    },
    setActiveSession,
    setIsSignedIn
  );
};

async function OAuthSignIn(formVals, setActiveSession, setIsSignedIn) {
  console.log("supa", formVals);
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


export const handleLogInSubmit = async (formVals, setActiveSession) => {

  if (formVals.email === "" || formVals.password == "") {
    // setLoginFail("Please fill out both email and password");
    return;
  } else {
    let accessToken = await signInStandard(formVals);
    if (accessToken) {
      await AsyncStorage.setItem("token", JSON.stringify(accessToken));
      setActiveSession(accessToken.session);
      // console.log("sign in reg", accessToken)
    } else {
      // setLoginFail("The credentials you supplied are not valid");
      return;
    }
    let checker = await sessionCheck();
    //  console.log("checkerbox", checker)
  }
};


export const handleSignUpSubmit = async (formVals, setActiveSession) => {


  if (
    formVals.email === "" ||
    formVals.password == "" ||
    formVals.name == ""
  ) {
    // setRegFail("Please fill out all fields");
    return;
  } else if (formVals.password.length < 6) {
    // setRegFail("Your password must be 6 characters or greater");
    return;
  } else {

    let nameSplit =  formVals.name.split(/ (.*)/s);
      let dataPack = {
        email: formVals.email,
        password:  formVals.password,
        firstName: nameSplit[0],
        lastName: nameSplit[1]
      }

    let registrationToken = await register(dataPack);
    if (registrationToken.session !== null) {
      await createProfile({
        id: registrationToken.session.user.id,
        email: formVals.email,
      });
      await AsyncStorage.setItem("token", JSON.stringify(registrationToken));
      setActiveSession(registrationToken);
    } else {
      // setRegFail(`You have already registered this account, please sign in`);
    }
    let checker = await sessionCheck();
    //  console.log("checkerbox", checker)
  }
};