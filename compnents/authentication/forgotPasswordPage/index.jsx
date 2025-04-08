import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import ForgotPageView from "./view";
import { supabase } from "../../../supabase";

WebBrowser.maybeCompleteAuthSession();

const createSessionFromUrl = async (url) => {
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

export default function ForgotPage(props) {
  const { moveToLoginPage, setEmailSent, emailSent } = props;

  const [formVals, setFormVals] = useState({ email: "" });
  const [isEnabled, setIsEnabled] = useState(true);

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  useEffect(() => {
    setIsEnabled(true);
  }, []);

  const passwordRecovery = async (email) => {
    setIsEnabled(false);
    // const resetPasswordURL = Linking.createURL('');
    // const resetPasswordURL = 'https://localhost:3000/account/password'; //dev
    const resetPasswordURL =
      "https://scubaseasons.netlify.app/account/password";

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        options: {
          redirectTo: resetPasswordURL,
          skipBrowserRedirect: true,
        },
      });

      setEmailSent("Password Reset Email Sent!, Check Your Inbox for it");

      if (error) {
        console.error("Error sending password recovery email:", error.message);
      } else {
        console.log("Password recovery email sent:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  return (
    <ForgotPageView
      moveToLoginPage={moveToLoginPage}
      setFormVals={setFormVals}
      formVals={formVals}
      isEnabled={isEnabled}
      passwordRecovery={passwordRecovery}
      emailSent={emailSent}
    />
  );
}
