import {
    Settings,
    LoginButton,
    AccessToken,
    Profile,
    LoginManager,
  } from "react-native-fbsdk-next";
  import * as AppleAuthentication from "expo-apple-authentication";
  import {
    GoogleSignin,
    GoogleSigninButton,
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
  export const facebookSignIn = async (setIsSignedIn) => {
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

  export const googleSignIn = async (setIsSignedIn) => {
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

  export const appleLogin = async (setIsSignedIn) => {
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
        handleOAuthSubmit(appleObject);
        setIsSignedIn(false);
      } else {
        let reUsedApple = {
          email: decoded.email,
          id: decoded.sub,
        };
        handleOAuthSubmit(reUsedApple);
      }
    } catch (e) {
      console.log(e);
    }
  };

    // Get User Data
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

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = Buffer.from(base64, "base64").toString("ascii");
    return JSON.parse(jsonPayload);
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

  async function OAuthSignIn(formVals, setActiveSession, setIsSignedIn) {
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