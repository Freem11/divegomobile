import React from "react";

import { basicSignIn } from "../../helpers/loginHelpers";
import { i18n } from "../../../i18n";
import { showWarning } from "../../toast";
import { useUserInit } from "../../../store/user/useUserInit";

import LoginPageView from "./view";
import { Form } from "./form";

interface IProps {
  moveToSignUpPage: () => void;
  moveToLandingPage: () => void;
  moveToForgotPasswordPage: () => void;
}

export default function LoginPage(props: IProps) {
  const initUserProfile = useUserInit();

  const onSubmit = async(data: Form) => {
    const response = await basicSignIn(data.Email, data.Password);
    if (response.error) {
      console.log("Error: ", response.error);
      if (response.error.status === 400){
        showWarning(i18n.t("Validators.invalidCredentials"));
      } else {
        showWarning(i18n.t("Common.unknownError"));

      }
      return;
    }

    if (response.data.session) {
      initUserProfile(true);
    }
  };

  return (
    <LoginPageView
      moveToLandingPage={props.moveToLandingPage}
      moveToForgotPasswordPage={props.moveToForgotPasswordPage}
      moveToSignUpPage={props.moveToSignUpPage}
      onSubmit={onSubmit}
    />
  );
}
