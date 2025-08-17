import React, { useState, useContext, useEffect } from "react";

import { SessionContext } from "../../contexts/sessionContext";
import { handleLogInSubmit } from "../../helpers/loginHelpers";
import { signInStandard } from "../../../supabaseCalls/authenticateSupabaseCalls";
import { useUserProfileStore } from "../../../store/useUserProfileStore";

import LoginPageView from "./view";
import { Form } from "./form";

export default function LoginPage(props) {
  const {
    moveToLandingPage,
    moveToSignUpPage,
    moveToForgotPasswordPage,
  } = props;

  const [loginFail, setLoginFail] = useState(null);
  const [formVals, setFormVals] = useState({ email: "", password: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const userProfileAction = useUserProfileStore(state => state.actions);

  const onSubmit = async(data: Form) => {
    userProfileAction.login(data.Email, data.Password);
    // const accessToken = await signInStandard(data.Email, data.Password);
    // if (accessToken && accessToken?.data?.session !== null) {
    //   userProfileAction.initProfile(true);
    // } else {
    //   setLoginFail(i18n.t("Validators.invalidCredentials"));

    //   // toast.error(screenData.SignInPage.signInError);
    //   return;
    // }
  };

  useEffect(() => {
    setLoginFail(null);
  }, [formVals]);

  return (
    <LoginPageView
      formVals={formVals}
      setFormVals={setFormVals}
      secureTextEntry={secureTextEntry}
      setSecureTextEntry={setSecureTextEntry}
      loginFail={loginFail}
      moveToLandingPage={moveToLandingPage}
      moveToForgotPasswordPage={moveToForgotPasswordPage}
      moveToSignUpPage={moveToSignUpPage}
      onSubmit={onSubmit}
    />
  );
}
