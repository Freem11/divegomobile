import React, { useState, useContext, useEffect } from "react";

import { basicSignIn } from "../../helpers/loginHelpers";
// import { signInStandard } from "../../../supabaseCalls/authenticateSupabaseCalls";
import { useUserProfileStore } from "../../../store/useUserProfileStore";
import { i18n } from "../../../i18n";
import { showWarning } from "../../toast";

import LoginPageView from "./view";
import { Form } from "./form";

interface IProps {
  moveToSignUpPage: () => void;
  moveToLandingPage: () => void;
  moveToForgotPasswordPage: () => void;
}

export default function LoginPage(props: IProps) {
  const userProfileAction = useUserProfileStore(state => state.actions);

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
      userProfileAction.initProfile(true);
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
