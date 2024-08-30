import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
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
import { handleLogInSubmit } from "../loginHelpers";
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
    moveToLandingPage,
    moveToSignUpPage,
  } = props;

  const [formVals, setFormVals] = useState({
    email: "",
    password: "",
  });

  const { setActiveSession } = useContext(SessionContext);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={"darkgrey"}
        onPress={() => moveToLandingPage()}
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

        <View style={{ marginTop: moderateScale(40) }}>
          <TextInputField
            icon={"lock-outline"}
            placeHolderText={passwordPlaceholder}
            setSecureTextEntry={setSecureTextEntry}
            secure={secureTextEntry}
            onChangeText={(text) =>
              setFormVals({ ...formVals, password: text })
            }
          />
        </View>

        <View style={styles.buttonBox}>
          <TouchableWithoutFeedback
            onPress={() => handleLogInSubmit(formVals, setActiveSession)}
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
      <View style={styles.promtBox}>
        <Text style={styles.promptText}>{promptText} </Text>
        <TouchableWithoutFeedback onPress={() => moveToSignUpPage()}>
          <Text style={styles.promptLinkText}>{promptLinkText}</Text>
        </TouchableWithoutFeedback>
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
    color: "darkgrey",
  },
  buttonBox: {
    width: "100%",
    alignItems: "flex-end",
  },
  promtBox: {
    position: "absolute",
    bottom: moderateScale(10),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
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
    { flexDirection: "row", marginTop: windowHeight / 10 },
  ],
  loginText: [buttonText, { marginHorizontal: moderateScale(5) }],
});
