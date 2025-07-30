import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import ForgotPageView from "./view";
import { supabase } from "../../../supabase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthenticationRoutes } from "../authNavigator";
import { useTranslation } from "react-i18next";

WebBrowser.maybeCompleteAuthSession();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
};

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthenticationRoutes,
  "ForgotPassword"
>;

export default function ForgotPasswordScreen() {
  const [emailSent, setEmailSent] = useState<string | null>(null);

  const [formVals, setFormVals] = useState({ email: "" });
  const [isEnabled, setIsEnabled] = useState(true);

  const url = Linking.useLinkingURL();
  if (url) createSessionFromUrl(url);

  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  useEffect(() => {
    setIsEnabled(true);
  }, []);

  const passwordRecovery = async (email: string) => {
    setIsEnabled(false);

    const { t } = useTranslation();

    // const resetPasswordURL = Linking.createURL("account/password/");
    const resetPasswordURL =
      "https://scubaseasons.netlify.app/account/password";
    try {
      if (formVals.email === "") {
        setEmailSent(t("Validators.fillEmail"));
      } else {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: resetPasswordURL,
            skipBrowserRedirect: true,
          }
        );
        setEmailSent("Password Reset Email Sent!, Check Your Inbox for it");

        if (error) {
          console.error(
            "Error sending password recovery email:",
            error.message
          );
        } else {
          console.log("Password recovery email sent:", data);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  return (
    <ForgotPageView
      moveToLoginPage={() => navigation.goBack()}
      setFormVals={setFormVals}
      formVals={formVals}
      isEnabled={isEnabled}
      passwordRecovery={passwordRecovery}
      emailSent={emailSent}
    />
  );
}
