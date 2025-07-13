import React, { useState, useContext, useEffect } from "react";
import LoginPageView from "./view";
import { SessionContext } from "../../contexts/sessionContext";
import { handleLogInSubmit } from "../../helpers/loginHelpers";

export default function LoginPage(props) {
  const {
    moveToLandingPage,
    moveToSignUpPage,
    loginFail,
    setLoginFail,
    moveToForgotPasswordPage,
  } = props;

  const [formVals, setFormVals] = useState({ email: "", password: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { setActiveSession } = useContext(SessionContext);

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
      handleLogin={() =>
        handleLogInSubmit(formVals, setActiveSession, setLoginFail)
      }
    />
  );
}
