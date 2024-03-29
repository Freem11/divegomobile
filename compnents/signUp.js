import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import { SessionContext } from "./contexts/sessionContext";
import {
  register,
  sessionCheck,
} from "../supabaseCalls/authenticateSupabaseCalls";
import { scale, moderateScale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import Headliner from "../compnents/png/Headliner.png";
import mantaIOS from "../compnents/png/Matt_Manta_White.png";
import { createProfile } from "../supabaseCalls/accountSupabaseCalls";

let emailVar = false;
let passwordVar = false;
let firstVar = false;
let lastVar = false;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
    } else if (formVals.password.length < 6) {
      setRegFail("Your password must be 6 characters or greater");
      return;
    } else {

      // need to handle for passowords of less than 6 characters
      let registrationToken = await register(formVals);
      if (registrationToken.session !== null) {
        await createProfile({id: registrationToken.session.user.id , email: formVals.email})
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
  const [subButState, setSubButState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.Headliner}>
      <Image source={mantaIOS} style={styles.manta}/>
      <Text style={{ fontFamily: "Caveat_400Regular", fontSize: scale(25), color: "white" }}>Scuba SEAsons</Text>
      </View>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keboardOffset}
      >
        <View style={styles.inputContainer}>
          <InsetShadow
            containerStyle={{
              borderRadius: moderateScale(25),
              height: moderateScale(40),
              width: moderateScale(200),
              marginTop: moderateScale(10),
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.5}
          >
            <TextInput
              style={formValidation.emailVal ? styles.inputRed : styles.input}
              value={formVals.email}
              placeholder={"Email"}
              placeholderTextColor="darkgrey"
              color={formValidation.emailVal ? "black" : "#F0EEEB"}
              fontSize={moderateScale(16)}
              onChangeText={(emailText) =>
                setFormVals({ ...formVals, email: emailText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: moderateScale(25),
              height: moderateScale(40),
              width: moderateScale(200),
              marginTop: moderateScale(10),
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.5}
          >
            <TextInput
              style={
                formValidation.passwordVal ? styles.inputRed : styles.input
              }
              value={formVals.password}
              placeholder={"Password"}
              fontSize={moderateScale(16)}
              secureTextEntry={true}
              placeholderTextColor="darkgrey"
              color={formValidation.passwordVal ? "black" : "#F0EEEB"}
              onChangeText={(passwordText) =>
                setFormVals({ ...formVals, password: passwordText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: moderateScale(25),
              height: moderateScale(40),
              width: moderateScale(200),
              marginTop: moderateScale(10),
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.5}
          >
            <TextInput
              style={
                formValidation.firstNameVal ? styles.inputRed : styles.input
              }
              value={formVals.firstName}
              placeholder={"First Name"}
              fontSize={moderateScale(16)}
              placeholderTextColor="darkgrey"
              color={formValidation.firstNameVal ? "black" : "#F0EEEB"}
              onChangeText={(firstText) =>
                setFormVals({ ...formVals, firstName: firstText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              borderRadius: moderateScale(25),
              height: moderateScale(40),
              width: moderateScale(200),
              marginTop: moderateScale(10),
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.5}
          >
            <TextInput
              style={
                formValidation.lastNameVal ? styles.inputRed : styles.input
              }
              value={formVals.lastName}
              placeholder={"Last Name"}
              fontSize={moderateScale(16)}
              placeholderTextColor="darkgrey"
              color={formValidation.lastNameVal ? "black" : "#F0EEEB"}
              onChangeText={(lastText) =>
                setFormVals({ ...formVals, lastName: lastText })
              }
              onFocus={() => setRegFail(null)}
            ></TextInput>
          </InsetShadow>
        </View>
        {regFail && <Text style={styles.erroMsg}>{regFail}</Text>}
      </KeyboardAvoidingView>
      <View style={subButState ? styles.SubmitButtonPressed : styles.SubmitButton}>
        <TouchableWithoutFeedback
          onPress={handleSignUpSubmit}
          onPressIn={() => setSubButState(true)}
          onPressOut={() => setSubButState(false)}
        >
          <Text
            style={{
              color: "gold",
              fontSize: windowWidth > 600 ? scale(10) : scale(17),
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
    marginTop: scale(10),
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538dbd",
    borderRadius: 10,
    width: moderateScale(200),
    height: moderateScale(40),
    alignSelf: "center",
    marginBottom: moderateScale(20),
    textAlign: "center",
    overflow: "hidden",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: moderateScale(200),
    height: moderateScale(40),
    alignSelf: "center",
    marginBottom: moderateScale(20),
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
    borderTopWidth: 0.3,
    zIndex: 2,
    width: "85%",
    borderTopColor: "darkgrey",
    // borderColor: "transparent",
    borderBottomColor: "transparent",
  },
  SubmitButtonPressed: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: "3%",
    marginLeft: 70,
    borderTopWidth: 0.3,
    zIndex: 2,
    width: "85%",
    borderTopColor: "darkgrey",
    // borderColor: "transparent",
    borderBottomColor: "transparent",
    backgroundColor: "#538aaa",
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
    fontFamily: "Itim_400Regular",
    borderStyle: "dashed",
    borderRadius: 10,
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: scale(10),
    alignSelf: "center"
  },
  Headliner: {
    height: "20%",
    width: "50%",
    marginTop: windowWidth > 700 ? moderateScale(10) : moderateScale(-50),
    marginBottom: windowWidth > 700 ?  moderateScale(70) : moderateScale(30),
    alignItems: "center",
    justifyContent: "center"
  },
  manta: {
    //  backgroundColor: "pink",
    height: scale(110),
    width: scale(90),
    marginBottom: scale(5)
  },
});
