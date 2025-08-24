import React, { useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";

import { SessionContext } from "../../contexts/sessionContext";
import {
  appleLogin,
  facebookSignIn,
  googleSignIn,
} from "../../helpers/loginHelpers";
import { useUserProfileStore } from "../../../store/useUserProfileStore";

import LandingPageView from "./view";

const googleWebClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const googleIOSClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

export default function LandingPage(props) {
  const { moveToLoginPage, moveToSignUpPage } = props;

  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const userProfileAction = useUserProfileStore(state => state.actions);
  const userProfile = useUserProfileStore(state => state.profile);
  const isSignedIn = !!userProfile;

  useEffect(() => {
    // Platform.OS === "ios"
    //   ? GoogleSignin.configure({
    //       scopes: ["profile"],
    //       iosClientId: googleIOSClientId,
    //     })
    //   : GoogleSignin.configure({
    //       scopes: ["profile"],
    //       webClientId: googleWebClientId,
    //     });

    (async() => {
      const isApple = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isApple);
    })();
  }, []);

  return (
    <LandingPageView
      isSignedIn={isSignedIn}
      appleAuthAvailable={appleAuthAvailable}
      onLogin={() => moveToLoginPage()}
      onSignUp={() => moveToSignUpPage()}
      onGoogle={() => {
        googleSignIn();
        userProfileAction.initProfile(true);
      }}
      onFacebook={() => {
        facebookSignIn();
        userProfileAction.initProfile(true);
      }}
      onApple={() => {
        appleLogin();
        userProfileAction.initProfile(true);
      }}
    />
  );
}
