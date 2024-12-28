import { Text, StyleSheet, View, TouchableWithoutFeedback, Dimensions } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from '../../supabase';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import TextInputField from "./textInput";
import {
  activeFonts,
  colors,
  fontSizes,
  buttonText,
  authenicationButton,
} from "../styles";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

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

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};



const sendMagicLink = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: redirectTo
    },
  });

  if (error) throw error;
  // Email sent.
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


export default function ForgotPage(props) {
  const {
    title,
    emailPlaceholder,
    buttonText,
    moveToLoginPage,
    setEmailSent,
    emailSent,
  } = props;

  useEffect(() => {
    setIsEnabled(true)
  },[])

  const [isEnabled, setIsEnabled] = useState(true);

  const [formVals, setFormVals] = useState({
    email: ""
  });

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  const passwordRecovery = async (email) => {

    setIsEnabled(false)
    const resetPasswordURL = Linking.createURL('');
  
    try {
      if(redirectTo){
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          options: {
            redirectTo,  // The URL to redirect to (your app)
            skipBrowserRedirect: true,     // Skip browser redirect
          },
        });
        setEmailSent("Password Reset Email Sent!, Check Your Inbox for it");
        if (error) {
          console.error('Error sending password recovery email:', error.message);
        } else {
          console.log('Password recovery email sent:', data);
        }
      }    
    } catch (err) {
      console.error('Unexpected error:', err.message);
    }
  }

  return (  <View style={styles.container}>
    <MaterialIcons
      name="chevron-left"
      size={moderateScale(48)}
      color={"darkgrey"}
      onPress={() => moveToLoginPage()}
    />
    <View style={styles.content}>
      <Text style={styles.header}>{title}</Text>

      <View style={{ marginTop: moderateScale(60) }}>
        <TextInputField
          icon={"alternate-email"}
          placeHolderText={emailPlaceholder}
          secure={false}
          onChangeText={(text) => setFormVals({ ...formVals, email: text })}
        />
      </View>

      {emailSent ? (
        <Text style={styles.erroMsg}>{emailSent}</Text>
      ) : (
        <View style={styles.erroMsgEmpty}></View>
      )}

      <View style={styles.buttonBox}>
        <TouchableWithoutFeedback
          onPress={isEnabled ? () => passwordRecovery(formVals.email): null}
        >
          <View style={styles.loginButton}>
            <Text style={styles.loginText}>{buttonText}</Text>
            <MaterialIcons
              name="chevron-right"
              size={30}
              color={colors.themeWhite}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  </View>
    // <View style={styles.container}>
    //   <Button onPress={() => sendMagicLink('freem1985@gmail.com')} title="Send Magic Link" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: windowHeight / 10,
    marginBottom: windowHeight / 25,
    width: windowWidth - windowWidth / 10,
    // backgroundColor: "pink",
  },
  header: {
    zIndex: 10,
    marginTop: "10%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Bold,
    color: "darkgrey",
  },
    loginButton: [
      authenicationButton,
      { width: '60%', flexDirection: "row", marginTop: windowHeight / 10 },
    ],
    loginText: [buttonText, { marginHorizontal: moderateScale(5) }],
    erroMsg: {
      minHeight: moderateScale(34),
      marginTop: moderateScale(15),
      fontSize: moderateScale(fontSizes.SmallText),
      fontFamily: activeFonts.Italic,
      color: "maroon",
    },
    erroMsgEmpty: {
      height: moderateScale(34),
      marginTop: moderateScale(15),
      fontSize: moderateScale(fontSizes.SmallText),
      fontFamily: activeFonts.Italic,
      color: "maroon",
    },
    buttonBox: {
      width: "100%",
      alignItems: "flex-end",
      marginTop: moderateScale(-50)
    },
});