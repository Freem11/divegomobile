import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { basicSignIn } from "../../helpers/loginHelpers";
import { i18n } from "../../../i18n";
import { showWarning } from "../../toast";
import { useUserHandler } from "../../../store/user/useUserHandler";
import { AuthenticationRoutes } from "../authNavigator";

import LoginPageView from "./view";
import { Form } from "./form";

export type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "Login"
>;

interface IProps {
  moveToSignUpPage: () => void;
  moveToLandingPage: () => void;
  moveToForgotPasswordPage: () => void;
}

export default function LoginScreen(props: IProps) {
  const userHandler = useUserHandler();

  const onSubmit = async(data: Form) => {
    const response = await basicSignIn(data.Email, data.Password);
    if (response.error) {
      console.log("Error: ", response.error);
      if (response.error.status === 400) {
        showWarning(i18n.t("Validators.invalidCredentials"));
      } else {
        showWarning(i18n.t("Common.unknownError"));

      }
      return;
    }

    if (response.data.session) {
      userHandler.userInit(true);
    }
  };

  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <LoginPageView
      moveToLandingPage={() => navigation.goBack()}
      moveToForgotPasswordPage={() => navigation.navigate("ForgotPassword")}
      moveToSignUpPage={() => navigation.replace("SignUp")}
      onSubmit={onSubmit}
    />
  );
}
