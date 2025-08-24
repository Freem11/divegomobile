import React, { useState, useContext, useEffect } from "react";
import { FieldErrors } from "react-hook-form";

import { register } from "../../../supabaseCalls/authenticateSupabaseCalls";
import { i18n } from "../../../i18n";
import { useUserProfileStore } from "../../../store/useUserProfileStore";
import { showWarning } from "../../toast";

import CreateAccountPageView from "./view";
import { Form } from "./form";

interface IProps {
  moveToLandingPage: () => void;
  moveToLoginPage: () => void;
}

export default function CreateAccountPage(props: IProps) {
  const userProfileAction = useUserProfileStore(state => state.actions);
  const [regFail, setRegFail] = useState(null);

  const onSubmit = async(data: Form) => {

    const response = await register(data.Email, data.Password, data.Name);

    if (response.error) {
      console.log(response.error);
      showWarning(i18n.t("Validators.accountExistMsg"));
      return;
    }

    if (response.data.session) {
      userProfileAction.initProfile(true);
    }
  };

  const handleError = (errors: FieldErrors<Form>) => {
    // toast.dismiss();
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        showWarning(error.message);

      }
    });
  };

  return (
    <CreateAccountPageView
      moveToLandingPage={props.moveToLandingPage}
      moveToLoginPage={props.moveToLoginPage}
      regFail={regFail}
      onSubmit={onSubmit}
    />
  );
}
