import React, { useState, useContext, useEffect } from "react";
import CreateAccountPageView from "./view";
import { SessionContext } from "../../contexts/sessionContext";
import { handleSignUpSubmit } from "../../helpers/loginHelpers";

export default function CreateAccountPage(props) {
  const {
    title,
    regFail,
    setRegFail,
    buttonText,
    promptText,
    promptLinkText,
    moveToLoginPage,
    namePlaceholder,
    emailPlaceholder,
    moveToLandingPage,
    passwordPlaceholder,
  } = props;

  const [formVals, setFormVals] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { setActiveSession } = useContext(SessionContext);

  useEffect(() => {
    setRegFail(null);
  }, [formVals]);

  return (
    <CreateAccountPageView
      title={title}
      namePlaceholder={namePlaceholder}
      emailPlaceholder={emailPlaceholder}
      passwordPlaceholder={passwordPlaceholder}
      buttonText={buttonText}
      promptText={promptText}
      promptLinkText={promptLinkText}
      moveToLandingPage={moveToLandingPage}
      moveToLoginPage={moveToLoginPage}
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
