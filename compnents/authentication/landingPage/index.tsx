import React, { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";

import {
  appleLogin,
  facebookSignIn,
  googleSignIn,
} from "../../helpers/loginHelpers";
import { useUserInit } from "../../../store/user/useUserInit";
import { useUserProfile } from "../../../store/user/useUserProfile";

import LandingPageView from "./view";

interface IProps {
  moveToSignUpPage: () => void;
  moveToLoginPage: () => void;
}

export default function LandingPage(props: IProps) {
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const userProfile = useUserProfile();
  const isSignedIn = !!userProfile;
  const initUserProfile = useUserInit();

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
        initUserProfile(true);
      }}
      onFacebook={() => {
        facebookSignIn();
        initUserProfile(true);
      }}
      onApple={() => {
        appleLogin();
        initUserProfile(true);
      }}
    />
  );
}
