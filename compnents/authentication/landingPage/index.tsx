import React, { useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";

import {
  appleLogin,
  facebookSignIn,
  googleSignIn,
} from "../../helpers/loginHelpers";
import { useUserHandler } from "../../../store/user/useUserHandler";
import { useUserProfile } from "../../../store/user/useUserProfile";

import LandingPageView from "./view";

interface IProps {
  moveToSignUpPage: () => void;
  moveToLoginPage: () => void;
}

export default function LandingPage(props: IProps) {
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const { userProfile } = useUserProfile();
  const isSignedIn = !!userProfile;
  const userHandler = useUserHandler();

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
      onGoogle={async() => {
        await googleSignIn();
        userHandler.userInit(true);
      }}
      onFacebook={async() => {
        await facebookSignIn();
        userHandler.userInit(true);
      }}
      onApple={async() => {
        await appleLogin();
        userHandler.userInit(true);
      }}
    />
  );
}
