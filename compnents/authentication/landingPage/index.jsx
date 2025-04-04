import React, { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { SessionContext } from "../../contexts/sessionContext";
import LandingPageView from "./view";
import {
  appleLogin,
  facebookSignIn,
  googleSignIn,
} from "../../helpers/loginHelpers";

const googleWebClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const googleIOSClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

export default function LandingPage(props) {
  const {
    title,
    buttonOneText,
    buttonTwoText,
    content,
    moveToLoginPage,
    moveToSignUpPage,
  } = props;

  const { setActiveSession } = useContext(SessionContext);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  useEffect(() => {
    Platform.OS === "ios"
      ? GoogleSignin.configure({
          scopes: ["profile"],
          iosClientId: googleIOSClientId,
        })
      : GoogleSignin.configure({
          scopes: ["profile"],
          webClientId: googleWebClientId,
        });

    (async () => {
      const isApple = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isApple);
    })();
  }, []);

  return (
    <LandingPageView
      title={title}
      loginButton={buttonOneText}
      registerButton={buttonTwoText}
      content={content}
      isSignedIn={isSignedIn}
      appleAuthAvailable={appleAuthAvailable}
      onLogin={() => moveToLoginPage()}
      onSignUp={() => moveToSignUpPage()}
      onGoogle={() => googleSignIn(setActiveSession, setIsSignedIn)}
      onFacebook={() => facebookSignIn(setActiveSession, setIsSignedIn)}
      onApple={() => appleLogin(setActiveSession, setIsSignedIn)}
    />
  );
}
