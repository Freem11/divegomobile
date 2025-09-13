import React from "react";

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

  const onSubmit = async(data: Form) => {

    const response = await register(data.Email, data.Password, data.Name);

    if (response.error) {
      console.log("Error: ", response.error);
      if (response.error.status === 422){
        showWarning(i18n.t("Validators.accountExistMsg"));
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
    <CreateAccountPageView
      moveToLandingPage={props.moveToLandingPage}
      moveToLoginPage={props.moveToLoginPage}
      onSubmit={onSubmit}
    />
  );
}
