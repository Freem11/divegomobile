import React from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { supabase } from "../../../supabase";
import { createSessionFromUrl } from "../../helpers/loginHelpers";
import { showError, showSuccess } from "../../toast";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthenticationRoutes } from "../authNavigator";

import { Form } from "./form";
import ForgotPageView from "./view";

WebBrowser.maybeCompleteAuthSession();

interface IProps {
  moveToLoginPage: () => void;
}

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "ForgotPassword"
>;

export default function ForgotPasswordScreen(props: IProps) {

  const url = Linking.useURL();
  if (url){
    createSessionFromUrl(url);
  }

  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

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
      moveToLoginPage={() => navigation.goBack()}
      onSubmit={onSubmit}
      defaultFormValues={{
        Email:""
      }}
    />
  );
}
