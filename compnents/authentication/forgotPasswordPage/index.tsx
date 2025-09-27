import React from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { supabase } from "../../../supabase";
import { createSessionFromUrl } from "../../helpers/loginHelpers";
import { showError, showSuccess } from "../../toast";

import { Form } from "./form";
import ForgotPageView from "./view";

WebBrowser.maybeCompleteAuthSession();

interface IProps {
  moveToLoginPage: () => void;
}

export default function ForgotPage(props: IProps) {

  const url = Linking.useURL();
  if (url){
    createSessionFromUrl(url);
  }

  const onSubmit = async(form: Form) => {

    // const resetPasswordURL = Linking.createURL("account/password/");
    const resetPasswordURL = "https://scubaseasons.netlify.app/account/password";

    const response = await supabase.auth.resetPasswordForEmail(form.Email, {
      redirectTo: resetPasswordURL,
      skipBrowserRedirect: true,
    });

    if (response.error){
      showSuccess("Password Reset Email Sent! Check Your Inbox for it");
    } else {
      showError("Error sending password recovery email. Please try again later");
      console.error("Error sending password recovery email:", response);
    }
  };

  return (
    <ForgotPageView
      moveToLoginPage={props.moveToLoginPage}
      onSubmit={onSubmit}
      defaultFormValues={{
        Email:""
      }}
    />
  );
}
