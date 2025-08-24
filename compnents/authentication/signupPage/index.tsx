import React, { useState, useContext, useEffect } from "react";

import { register } from "../../../supabaseCalls/authenticateSupabaseCalls";
import { i18n } from "../../../i18n";
import { useUserProfileStore } from "../../../store/useUserProfileStore";

import CreateAccountPageView from "./view";
import { Form } from "./form";

export default function CreateAccountPage(props) {
  const { regFail, setRegFail, moveToLoginPage, moveToLandingPage } = props;

  const userProfileAction = useUserProfileStore(state => state.actions);

  const onSubmit = async(data: Form) => {

    const response = await register(data.Email, data.Password, data.Name);

    if (response.error) {
      console.log(response.error);
      setRegFail(i18n.t("Validators.accountExistMsg"));
      return;
    }

    if (response.data.session) {
      userProfileAction.initProfile(true);
    }
  };

  return (
    <CreateAccountPageView
      moveToLandingPage={moveToLandingPage}
      moveToLoginPage={moveToLoginPage}
      regFail={regFail}
      onSubmit={onSubmit}

      // handleSignUp={() =>
      //   handleSignUpSubmit(formVals, setActiveSession, setRegFail)}
    />
  );
}
