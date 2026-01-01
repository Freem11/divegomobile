import React from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { supabase } from "../../../supabase";
import { createSessionFromUrl } from "../../helpers/loginHelpers";
import { showError, showSuccess } from "../../toast";
import { AuthenticationRoutes } from "../authNavigator";
import { resetPasswordURL } from "../../globalVariables";

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

  React.useEffect(() => {
    if (url) {
      createSessionFromUrl(url);
    }
  }, [url]);

  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  const onSubmit = async (form: Form) => {
    try {
      // Ensure this matches your Supabase Dashboard "Redirect URLs" exactly

      console.log("Attempting reset for:", form.Email);

      const { error } = await supabase.auth.resetPasswordForEmail(form.Email!, {
        redirectTo: resetPasswordURL,
      });

      if (error) {
        console.error("Supabase Auth Error:", error.message);
        showError(error.message);
      } else {
        console.log("Reset email sent successfully");
        showSuccess(`A reset link has bee sent to ${form.Email} Check your inbox for it!`);
      }
    } catch (err) {
      console.error("Critical Submission Error:", err);
      showError("Something went wrong. Please check your connection.");

    }
  };

  return (
    <ForgotPageView
      moveToLoginPage={() => navigation.goBack()}
      onSubmit={onSubmit}
      defaultFormValues={{ Email: "" }}
    />
  );
}