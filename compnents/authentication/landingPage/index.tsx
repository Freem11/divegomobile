import React, { useEffect, useState, useLayoutEffect } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  appleLogin,
  facebookSignIn,
  googleSignIn,
} from "../../helpers/loginHelpers";
import { useUserHandler } from "../../../store/user/useUserHandler";
import { useUserProfile } from "../../../store/user/useUserProfile";
import { AuthenticationRoutes } from "../authNavigator";

import LandingPageView from "./view";

type LandingScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "Landing"
>;

interface IProps {
  moveToSignUpPage: () => void;
  moveToLoginPage: () => void;
}

export default function LandingScreen(props: IProps) {
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const { userProfile } = useUserProfile();
  const isSignedIn = !!userProfile;
  const userHandler = useUserHandler();

  const navigation = useNavigation<LandingScreenNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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
      onLogin={() => navigation.navigate("Login")}
      onSignUp={() => navigation.navigate("SignUp")}
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
