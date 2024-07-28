import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import { SessionContext } from "./contexts/sessionContext";
import {
  register,
  sessionCheck,
} from "../supabaseCalls/authenticateSupabaseCalls";
import { scale, moderateScale } from "react-native-size-matters";
import mantaIOS from "../compnents/png/Matt_Manta_White.png";
import { createProfile } from "../supabaseCalls/accountSupabaseCalls";
import SubmitButton from "./reusables/submitButton";
import InputField from "./reusables/textInputs";

let emailVar = false;
let passwordVar = false;
let firstVar = false;
let lastVar = false;

const windowWidth = Dimensions.get("window").width;

export default function SignUpRoute() {
  const { setActiveSession } = useContext(SessionContext);

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
        await createProfile({
          id: registrationToken.session.user.id,
          email: formVals.email,
        });
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
      <View style={styles.Headliner}>
        <Image source={mantaIOS} style={styles.manta} />
        <Text
          style={{
            fontFamily: "Caveat_400Regular",
            fontSize: scale(25),
            color: "white",
          }}
        >
          Scuba SEAsons
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keboardOffset}
      >
        <View style={styles.inputContainer}>
          <InputField
            validationItem={formValidation.emailVal}
            placeHolderText={"Email"}
            inputValue={formVals.email}
            keyboardType={"default"}
            onChangeText={(text) => setFormVals({ ...formVals, email: text })}
          />
          <View style={styles.inputBox}>
            <InputField
              validationItem={formValidation.passwordVal}
              placeHolderText={"Password"}
              inputValue={formVals.password}
              keyboardType={null}
              onChangeText={(text) =>
                setFormVals({ ...formVals, password: text })
              }
              secure={true}
            />
          </View>
          <View style={styles.inputBox}>
            <InputField
              validationItem={formValidation.firstNameVal}
              placeHolderText={"First Name"}
              inputValue={formVals.firstName}
              keyboardType={"default"}
              onChangeText={(text) =>
                setFormVals({ ...formVals, firstName: text })
              }
            />
          </View>
          <View style={styles.inputBox}>
            <InputField
              validationItem={formValidation.lastNameVal}
              placeHolderText={"Last Name"}
              inputValue={formVals.lastName}
              keyboardType={"default"}
              onChangeText={(text) =>
                setFormVals({ ...formVals, lastName: text })
              }
            />
          </View>
        </View>
        {regFail && <Text style={styles.erroMsg}>{regFail}</Text>}
      </KeyboardAvoidingView>

      <SubmitButton buttonAction={handleSignUpSubmit} label={"Sign Up"} />
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
  inputBox: {
    marginTop: moderateScale(10),
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
    alignSelf: "center",
  },
  Headliner: {
    height: "20%",
    width: "50%",
    marginTop: windowWidth > 700 ? moderateScale(10) : moderateScale(-50),
    marginBottom: windowWidth > 700 ? moderateScale(70) : moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
  },
  manta: {
    //  backgroundColor: "pink",
    height: scale(110),
    width: scale(90),
    marginBottom: scale(5),
  },
});
