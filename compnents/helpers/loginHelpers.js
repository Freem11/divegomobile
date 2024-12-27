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
} from "../../supabaseCalls/authenticateSupabaseCalls";
import { createProfile, grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { supabase } from '../../supabase';
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";

const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

//Sign Ins
export const facebookSignIn = async (setActiveSession, setIsSignedIn) => {
  setIsSignedIn(true);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    let data = await createSessionFromUrl(url);
    handleSupabaseSetup(data, setActiveSession, setIsSignedIn)
  }
};

export const googleSignIn = async (setActiveSession, setIsSignedIn) => {
  try {
    setIsSignedIn(true);
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn()
    .then(userInfo => {
      console.log('User info: ', userInfo);
    })
    .catch(error => {
      console.error('Google Sign-In Error: ', error);
    });
    console.log('end', userInfo)
    if (userInfo.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.idToken,
      })
      console.log(data)
      handleSupabaseSetup(data, setActiveSession, setIsSignedIn)
    } else {
      throw new Error('no ID token present!')
    }
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
    const userInfo = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (userInfo.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: userInfo.identityToken,
      })
      handleSupabaseSetup(data, setActiveSession, setIsSignedIn)
    } else {
      throw new Error('no ID token present!')
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

async function handleSupabaseSetup(sessionToken, setActiveSession, setIsSignedIn) {
  if (sessionToken) {
    await AsyncStorage.setItem("token", JSON.stringify(sessionToken));
    if(sessionToken.session){
      setActiveSession(sessionToken.session);
    } else {
      setActiveSession(sessionToken);
    }
    setIsSignedIn(false);
    let sanitizeData
    if(sessionToken.session){
      sanitizeData = sessionToken.session
    } else {
      sanitizeData = sessionToken
    }
 
    let profileCheck = await grabProfileById(sanitizeData.user.id)

   if(profileCheck.length === 0){
      await createProfile({
        id: sanitizeData.user.id,
        email: sanitizeData.user.email,
      });
      console.log('profile created!')
   }
  }
}


async function OAuthSignIn(formVals, setActiveSession, setIsSignedIn) {
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


export const handleLogInSubmit = async (formVals, setActiveSession, setLoginFail) => {

  if (formVals.email === "" || formVals.password == "") {
    setLoginFail("Please fill out both email and password");
    return;
  } else {
    let accessToken = await signInStandard(formVals);
    console.log("accessToken", accessToken)
    if (accessToken && accessToken?.data?.session !== null) {
      await AsyncStorage.setItem("token", JSON.stringify(accessToken?.data.session.refresh_token));
      setActiveSession(accessToken.data.session);
      // console.log("sign in reg", accessToken)
    } else {
      setLoginFail("The credentials you supplied are not valid");
      return;
    }
    let checker = await sessionCheck();
    //  console.log("checkerbox", checker)
  }
};


export const handleSignUpSubmit = async (formVals, setActiveSession, setRegFail) => {

  if (
    formVals.email === "" ||
    formVals.password == "" ||
    formVals.name == ""
  ) {
    setRegFail("Please fill out all fields");
    return;
  } else if (formVals.password.length < 6) {
    setRegFail("Your password must be 6 characters or greater");
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
      setRegFail(`You have already registered this account, please use the log in page`);
    }
    let checker = await sessionCheck();
    //  console.log("checkerbox", checker)
  }
};