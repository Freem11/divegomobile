import React, { useState, useContext, useEffect } from "react";

import { SessionContext } from "../../contexts/sessionContext";
import { basicSignIn } from "../../helpers/loginHelpers";
// import { signInStandard } from "../../../supabaseCalls/authenticateSupabaseCalls";
import { useUserProfileStore } from "../../../store/useUserProfileStore";
import { supabase } from "../../../supabase";
import { i18n } from "../../../i18n";

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

    const response = await basicSignIn(data.Email, data.Password);

    if (response.error) {
      console.log(response.error);
      setLoginFail(i18n.t("Validators.invalidCredentials"));
      return;
    }

    if (response.data.session) {
      userProfileAction.initProfile(true);
    }
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
