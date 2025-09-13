import React, { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";

import {
  appleLogin,
  facebookSignIn,
  googleSignIn,
} from "../../helpers/loginHelpers";
import { useUserProfileStore } from "../../../store/useUserProfileStore";

import LandingPageView from "./view";

interface IProps {
  moveToSignUpPage: () => void;
  moveToLoginPage: () => void;
}

export default function LandingPage(props: IProps) {

  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const userProfileAction = useUserProfileStore(state => state.actions);
  const userProfile = useUserProfileStore(state => state.profile);
  const isSignedIn = !!userProfile;

  useEffect(() => {
    (async() => {
      const isApple = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isApple);
    })();
  }, []);

  return (
    <LandingPageView
      isSignedIn={isSignedIn}
      appleAuthAvailable={appleAuthAvailable}
      onLogin={() => props.moveToLoginPage()}
      onSignUp={() => props.moveToSignUpPage()}
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
