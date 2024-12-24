import { Button, StyleSheet, View } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from '../../supabase';


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

const passwordRecovery = async (email) => {
console.log(email, redirectTo)
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo,
  })

  console.log(data, error)

}

export default function ForgotPage() {
  // Handle linking into app from email app.
//   const url = Linking.useURL();
//   if (url) createSessionFromUrl(url);

  return (
    <View style={styles.container}>
      <Button onPress={() => passwordRecovery('freem1985@gmail.com')} title="Forgot Password?" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#fff",
      // backgroundColor: "pink",
    }
});