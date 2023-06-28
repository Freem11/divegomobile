import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import { SessionContext } from "./contexts/sessionContext";
import {
  register,
  sessionCheck,
} from "../supabaseCalls/authenticateSupabaseCalls";
import { scale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import Headliner from "../compnents/png/Headliner.png";

let emailVar = false;
let passwordVar = false;
let firstVar = false;
let lastVar = false;

export default function SignUpRoute() {
  const { activeSession, setActiveSession } = useContext(SessionContext);

  const [regFail, setRegFail] = useState(null);

  const [formVals, setFormVals] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [formValidation, SetFormValidation] = useState({
    emailVal: false,
    passwordVal: false,
  });

  const handleSignUpSubmit = async () => {
    if (formVals.email === "" || formVals.email === null) {
      emailVar = true;
    } else {
      emailVar = false;
    }

    if (formVals.password === "" || formVals.password === null) {
      passwordVar = true;
    } else {
      passwordVar = false;
    }

    if (formVals.firstName === "" || formVals.firstName === null) {
      firstVar = true;
    } else {
      firstVar = false;
    }

    if (formVals.lastName === "" || formVals.lastName === null) {
      lastVar = true;
    } else {
      lastVar = false;
    }

    SetFormValidation({
      ...formValidation,
      emailVal: emailVar,
      passwordVal: passwordVar,
      firstNameVal: firstVar,
      lastNameVal: lastVar,
    });

    if (
      formVals.email === "" ||
      formVals.password == "" ||
      formVals.firstName == "" ||
      formVals.lastName == ""
    ) {
      setRegFail("Please fill out all fields");
      return;
    } else {
      let registrationToken = await register(formVals);
      console.log("reggie", registrationToken);
      if (registrationToken.session !== null) {
        await AsyncStorage.setItem("token", JSON.stringify(registrationToken));
        setActiveSession(registrationToken);
      } else {
        setRegFail(`You have already registered this account, please sign in`);
      }
      let checker = await sessionCheck();
      //  console.log("checkerbox", checker)
    }
  };

  const keboardOffset = Platform.OS === "ios" ? 100 : 0;

  return (
    <View style={styles.container}>
      <Image source={Headliner} style={[styles.Headliner]} />

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keboardOffset}
      >
        <View style={styles.inputContainer}>
          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 10,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.3}
          >
            <TextInput
              style={formValidation.emailVal ? styles.inputRed : styles.input}
              value={formVals.email}
              placeholder={"Email"}
              placeholderTextColor="darkgrey"
              color="#F0EEEB"
              fontSize={18}
              onChangeText={(emailText) =>
                setFormVals({ ...formVals, email: emailText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 10,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.3}
          >
            <TextInput
              style={
                formValidation.passwordVal ? styles.inputRed : styles.input
              }
              value={formVals.password}
              placeholder={"Password"}
              fontSize={18}
              secureTextEntry={true}
              placeholderTextColor="darkgrey"
              color="#F0EEEB"
              onChangeText={(passwordText) =>
                setFormVals({ ...formVals, password: passwordText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 10,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.3}
          >
            <TextInput
              style={
                formValidation.firstNameVal ? styles.inputRed : styles.input
              }
              value={formVals.firstName}
              placeholder={"First Name"}
              fontSize={18}
              placeholderTextColor="darkgrey"
              color="#F0EEEB"
              onChangeText={(firstText) =>
                setFormVals({ ...formVals, firstName: firstText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 10,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.3}
          >
            <TextInput
              style={
                formValidation.lastNameVal ? styles.inputRed : styles.input
              }
              value={formVals.lastName}
              placeholder={"Last Name"}
              fontSize={18}
              placeholderTextColor="darkgrey"
              color="#F0EEEB"
              onChangeText={(lastText) =>
                setFormVals({ ...formVals, lastName: lastText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>
        </View>
        {regFail && <Text style={styles.erroMsg}>{regFail}</Text>}
        </KeyboardAvoidingView>
        <View style={styles.SubmitButton}>
          <TouchableWithoutFeedback onPress={handleSignUpSubmit}>
            <Text
              style={{
                color: "gold",
                fontSize: 17,
                marginTop: 8,
                fontFamily: "PermanentMarker_400Regular",
                width: "100%",
                alignSelf: "center",
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              Sign Up
            </Text>
          </TouchableWithoutFeedback>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538dbd",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  input: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "#538dbd",
    borderRadius: 10,
    width: scale(200),
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  inputRed: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: scale(200),
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  text: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 5,
  },
  SubmitButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: "3%",
    marginLeft: 70,
    borderWidth: 0.3,
    zIndex: 2,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
  },
  SubmitButton2: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: "3%",
    marginLeft: 70,
    borderWidth: 0.3,
    zIndex: 2,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
  },
  singups: {
    marginTop: "25%",
    marginBottom: "-23%",
  },
  SignUpWithButtons: {
    backgroundColor: "#33586A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(5),
    height: scale(35),
    width: scale(200),
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  fbLogo: {
    height: 25,
    width: 25,
    opacity: 0.5,
    marginRight: 0,
  },
  gLogo: {
    height: 18,
    width: 18,
    opacity: 0.5,
    marginRight: 10,
  },
  erroMsg: {
    margin: 5,
    padding: 7,
    color: "pink",
    fontFamily: "IndieFlower_400Regular",
    borderStyle: "dashed",
    borderRadius: 10,
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: scale(10),
  },
  Headliner: {
    height: scale(250),
    width: "100%",
    marginLeft: "-3%",
    marginTop: "-5%",
  },
});
