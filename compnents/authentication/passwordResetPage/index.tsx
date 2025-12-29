import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { supabase } from "../../../supabase";
import { showError, showSuccess } from "../../toast";
import { AuthenticationRoutes } from "../authNavigator";

import { Form } from "./form";
import ResetPageView from "./view";

interface IProps {
  moveToLoginPage: () => void;
}

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "ResetPasswordConfirm"
>;

export default function ResetPasswordScreen(props: IProps) {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();

  const onSubmit = async (form: Form) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: form.NewPass,
      });

      if (error) {
        console.error("Update Password Error:", error.message);
        showError(error.message);
      } else {
        showSuccess("Password updated! Please log in with your new password.");
        navigation.navigate("Login");
      }
    } catch (err) {
      console.error("Critical Reset Error:", err);
      showError("An unexpected error occurred.");
    }
  };

  return (
    <ResetPageView
      moveToLoginPage={() => navigation.goBack()}
      onSubmit={onSubmit}
      defaultFormValues={{ NewPass: "" }}
    />
  );
}