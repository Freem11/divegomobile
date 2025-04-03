import React, { useState, useContext, useEffect } from "react";
import { Keyboard } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import LoginPageView from "./view";
import { SessionContext } from "../../contexts/sessionContext";
import { handleLogInSubmit } from "../../helpers/loginHelpers";

export default function LoginPage(props) {
  const {
    title,
    emailPlaceholder,
    passwordPlaceholder,
    buttonText,
    promptText,
    promptLinkText,
    moveToLandingPage,
    moveToSignUpPage,
    loginFail,
    setLoginFail,
    moveToForgotPasswordPage,
    forgotPromt,
  } = props;

  const [formVals, setFormVals] = useState({ email: "", password: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { setActiveSession } = useContext(SessionContext);

  useEffect(() => {
    setLoginFail(null);
  }, [formVals]);

  return (
    <LoginPageView
      title={title}
      emailPlaceholder={emailPlaceholder}
      passwordPlaceholder={passwordPlaceholder}
      buttonText={buttonText}
      promptText={promptText}
      promptLinkText={promptLinkText}
      forgotPromt={forgotPromt}
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
