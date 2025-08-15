import React, { useState, useContext, useEffect } from "react";
import LoginPageView from "./view";
import { SessionContext } from "../../contexts/sessionContext";
import { handleLogInSubmit } from "../../helpers/loginHelpers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthenticationRoutes } from "../authNavigator";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "Login"
>;

export default function LoginScreen() {
  const [loginFail, setLoginFail] = useState<string | null>(null);

  const [formVals, setFormVals] = useState({ email: "", password: "" });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { setActiveSession } = useContext(SessionContext);

  const navigation = useNavigation<LoginScreenNavigationProp>();

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
      moveToLandingPage={() => navigation.goBack()}
      moveToForgotPasswordPage={() => navigation.navigate("ForgotPassword")}
      moveToSignUpPage={() => navigation.replace("SignUp")}
      handleLogin={() =>
        handleLogInSubmit(formVals, setActiveSession, setLoginFail)
      }
    />
  );
}
