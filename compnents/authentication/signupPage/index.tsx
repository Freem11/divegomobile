import React, { useState, useContext, useEffect } from "react";
import CreateAccountPageView from "./view";
import { SessionContext } from "../../contexts/sessionContext";
import { handleSignUpSubmit } from "../../helpers/loginHelpers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthenticationRoutes } from "../authNavigator";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "SignUp"
>;

export default function SignUpScreen() {
  const [regFail, setRegFail] = useState<string | null>(null);

  const [formVals, setFormVals] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { setActiveSession } = useContext(SessionContext);

  const navigation = useNavigation<SignUpScreenNavigationProp>();

  useEffect(() => {
    setRegFail(null);
  }, [formVals]);

  return (
    <CreateAccountPageView
      moveToLandingPage={() => navigation.goBack()}
      moveToLoginPage={() => navigation.replace("Login")}
      regFail={regFail}
      formVals={formVals}
      setFormVals={setFormVals}
      secureTextEntry={secureTextEntry}
      setSecureTextEntry={setSecureTextEntry}
      handleSignUp={() =>
        handleSignUpSubmit(formVals, setActiveSession, setRegFail)
      }
    />
  );
}
