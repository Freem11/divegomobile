import * as AppleAuthentication from "expo-apple-authentication";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { Session } from "@supabase/supabase-js";

import { sessionCheck } from "../../supabaseCalls/authenticateSupabaseCalls";
import { supabase } from "../../supabase";

const redirectTo = makeRedirectUri();

export const getSession = async() => {
  const session = await sessionCheck();
  console.log({ session });

  // if(session.error) {
  //   storedToken = JSON.parse(await SecureStore.getItemAsync("token"));
  //   if (storedToken && typeof storedToken === "string") {
  //     const newSession = await sessionRefresh(storedToken);
  // }

  if (session.error) {
    console.log("Unable to initialize session", session.error);
    return null;
  }

  if (!session.data.session?.user.id) {
    return null;
  }

  return session.data.session as Session;
};

export const createSessionFromUrl = async(url: string) => {
  console.log("Processing URL:", url);

  const splitByHash = url.split("#");
  const splitByQuery = url.split("?");

  const dataString = splitByHash[1] || splitByQuery[1];

  if (!dataString) {
    console.log("No token data found in URL structure");
    return;
  }

  const params: any = {};
  dataString.split("&").forEach((part) => {
    const [key, value] = part.split("=");
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  });

  const { access_token, refresh_token } = params;

  if (!access_token || !refresh_token) {
    console.log("Missing tokens. Found params:", Object.keys(params));
    return;
  }

  console.log("Valid tokens found. Setting Supabase session...");

  const { data: sessionData, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    console.error("Supabase setSession error:", error.message);
    throw error;
  }

  return sessionData.session;
};

//Sign Ins
export const facebookSignIn = async() => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo,
        skipBrowserRedirect: true
      }
    });

    if (data) {
      const res = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
      );

      if (res.type === "cancel") {
        throw error;
      }

      if (res.type === "success") {
        // const { url } = res;
        // const data = await createSessionFromUrl(url);
        // handleSupabaseSetup(data, setActiveSession, setIsSignedIn);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const basicSignIn = async(email, password) => {
  const response = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return response;
};

export const googleSignIn = async() => {
  // TODO: add ability to sign out and choose another google account
  // await GoogleSignin.signOut();
  // await GoogleSignin.revokeAccess();
  const configParams = {
    scopes: ["profile"],
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
  };

  if (Platform.OS === "ios") {
    configParams.iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
  }

  try {
    GoogleSignin.configure(configParams);
    const userInfo = await GoogleSignin.signIn();
    const response = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: userInfo.idToken
    });

    return response;
  } catch (error) {
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

  return null;
};

export const appleLogin = async() => {
  try {
    const userInfo = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ]
    });

    if (userInfo.identityToken) {
      const response = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: userInfo.identityToken
      });

      if (response.error) {
        throw response.error;
      }

    } else {
      throw new Error("no ID token present!");
    }
  } catch (e) {
    console.log(e);
  }
};

// async function handleSupabaseSetup(
//   sessionToken,
//   setActiveSession,
//   setIsSignedIn
// ) {
//   if (sessionToken) {
//     await SecureStore.setItemAsync(
//       "token",
//       JSON.stringify(sessionToken.session.refresh_token)
//     );
//     if (sessionToken.session) {
//       setActiveSession(sessionToken.session);
//     } else {
//       setActiveSession(sessionToken);
//     }
//     setIsSignedIn(false);
//     let sanitizeData;
//     if (sessionToken.session) {
//       sanitizeData = sessionToken.session;
//     } else {
//       sanitizeData = sessionToken;
//     }

//     const profileCheck = await grabProfileByUserId(sanitizeData.user.id);

//     if (profileCheck.length === 0) {
//       await createProfile({
//         id: sanitizeData.user.id,
//         email: sanitizeData.user.email
//       });
//       console.log("profile created!");
//     }
//   }
// }

// export const handleLogInSubmit = async(
//   formVals,
//   setActiveSession,
//   setLoginFail
// ) => {
//   if (formVals.email === "" || formVals.password == "") {
//     setLoginFail(i18n.t("Validators.fillEmailAndPassword"));
//     return;
//   } else {
//     const accessToken = await signInStandard(formVals);
//     if (accessToken && accessToken?.data?.session !== null) {
//       await SecureStore.setItemAsync(
//         "token",
//         JSON.stringify(accessToken?.data.session.refresh_token)
//       );

//       setActiveSession(accessToken.data.session);
//     } else {
//       setLoginFail(i18n.t("Validators.invalidCredentials"));
//       return;
//     }
//     await sessionCheck();
//   }
// };

// export const handleSignUpSubmit = async(
//   formVals,
//   setActiveSession,
//   setRegFail
// ) => {
//   if (formVals.email === "" || formVals.password == "" || formVals.name == "") {
//     setRegFail(i18n.t("Validators.fillAllFields"));
//     return;
//   } else if (formVals.password.length < 6) {
//     setRegFail(i18n.t("Validators.passwordFormat"));
//     return;
//   } else {
//     const dataPack = {
//       email: formVals.email,
//       password: formVals.password,
//       name: formVals.name
//     };

//     const registrationToken = await register(dataPack);
//     console.log("registrationToken", registrationToken);
//     if (registrationToken.data.session !== null) {
//       await createProfile({
//         id: registrationToken.data.session.user.id,
//         email: formVals.email
//       });
//       await SecureStore.setItemAsync(
//         "token",
//         JSON.stringify(registrationToken)
//       );
//       setActiveSession(registrationToken.data.session);
//     } else {
//       setRegFail(i18n.t("Validators.accountExistMsg"));
//     }
//     await sessionCheck();
//   }
// };
