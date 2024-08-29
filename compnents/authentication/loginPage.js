import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import {
  activeFonts,
  colors,
  buttonText,
  authenicationButton,
} from "../styles";
import TextInputField from "./textInput";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { appleLogin, googleSignIn, facebookSignIn } from "../loginHelpers";
import { moderateScale } from "react-native-size-matters";
import { SessionContext } from "../contexts/sessionContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function LoginPage(props) {
  const {
    title,
    emailPlaceholder,
    passwordPlaceholder,
    buttonText,
    promptText,
    promptLinkText,
  } = props;

  const { setActiveSession } = useContext(SessionContext);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={styles.container}>
      <MaterialIcons name="chevron-left" size={48} color={colors.themeBlack} />
      <View style={styles.content}>
        <Text style={styles.header}>{title}</Text>

        <View style={{ marginTop: moderateScale(60) }}>
          <TextInputField
            icon={"alternate-email"}
            placeHolderText={emailPlaceholder}
            secure={false}
          />
        </View>

        <View style={{ marginTop: moderateScale(40) }}>
          <TextInputField
            icon={"lock-outline"}
            placeHolderText={passwordPlaceholder}
            setSecureTextEntry={setSecureTextEntry}
            secure={secureTextEntry}
          />
        </View>
        <View style={styles.buttonBox}>
        <View style={styles.loginButton}>
          <Text style={styles.loginText}>{buttonText}</Text>
          <MaterialIcons
            name="chevron-right"
            size={30}
            color={colors.themeWhite}
          />
        </View>
        </View>

        <View style={styles.promtBox}>
          <Text style={styles.promptText}>{promptText} </Text>
          <TouchableWithoutFeedback onPress={() => null}>
            <Text style={styles.promptLinkText}>{promptLinkText}</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
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
  content: {
    marginHorizontal: "7%",
  },
  header: {
    zIndex: 10,
    marginTop: "10%",
    fontSize: moderateScale(34),
    fontFamily: activeFonts.Bold,
    color: colors.themeBlack,
  },
  buttonBox: {
    width: "100%",
    alignItems: "flex-end",
  },
  promtBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "110%",
  },
  promptText: {
    fontSize: moderateScale(15),
    fontFamily: activeFonts.Italic,
    color: colors.themeBlack,
  },
  promptLinkText: {
    marginTop: moderateScale(1),
    fontSize: moderateScale(14),
    fontFamily: activeFonts.thin,
    color: colors.primaryBlue,
  },
  loginButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 20 },
  ],
  loginText: [buttonText, { marginHorizontal: moderateScale(5) }],
});
