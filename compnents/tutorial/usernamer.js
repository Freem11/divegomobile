import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { scale, s } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import { IterratorContext } from "../contexts/iterratorContext";
import { SessionContext } from "../contexts/sessionContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";

let userVar = false;

export default function UserNamer() {
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { itterator, setItterator } = useContext(IterratorContext);
  const [userFail, setUserFail] = useState(null);
  const [subButState, setSubButState] = useState(false);

  const [formVal, setFormVal] = useState({
    userName: "",
  });

  const [formValidation, SetFormValidation] = useState({
    userName: "",
  });

  const handleSubmit = async () => {
    if (formVal.userName === "" || formVal.userName === null) {
      userVar = true;
    } else {
      userVar = false;
    }

    SetFormValidation({
      ...formValidation,
      userName: userVar,
    });

    if (formVal.userName === "") {
      setUserFail("Your Username cannot be blank!");  
    } else {
      let sessionUserId = activeSession.user.id;
      console.log(sessionUserId, formVal.userName)
      try {
        const success = await updateProfile({
          id: sessionUserId,
          username: formVal.userName,
        });
        if (success.length > 0) {
          setItterator(itterator + 1);
          setFormVal({ userName: "" });
          setProfile([{...profile, UserName: formVal.userName}])

        } else {
          setUserFail("Sorry that username has already been taken")
        }
      } catch (e) {
        setUserFail("Sorry that username has already been taken")
        console.log({ title: "Error", message: e.message });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>What is your diver name?</Text>
      <InsetShadow
        containerStyle={{
          borderRadius: 25,
          height: 40,
          width: 200,
          marginLeft: 9,
          marginTop: 15,
        }}
        elevation={20}
        shadowRadius={15}
        shadowOpacity={0.5}
      >
        <TextInput
          style={formValidation.userName ? styles.inputRed : styles.input}
          value={formVal.userName}
          placeholder={"User Name"}
          fontSize={18}
          placeholderTextColor="darkgrey"
          color="#F0EEEB"
          onChangeText={(InputText) =>
            setFormVal({ ...formVal, userName: InputText })
          }
          onFocus={() => setUserFail(null)}
          onPress={() => setUserFail(null)}
        ></TextInput>
      </InsetShadow>

      {userFail && <Text style={styles.erroMsg}>{userFail}</Text>}

      <View style={subButState ? styles.OKbuttonPressed : styles.OKbutton}>
        <TouchableWithoutFeedback
          onPress={handleSubmit}
          onPressIn={() => setSubButState(true)}
          onPressOut={() => setSubButState(false)}
        >
          <Text
            style={{
              color: "gold",
              fontSize: 17,
              marginTop: 0,
              fontFamily: "PermanentMarker_400Regular",
              width: "100%",
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            Ok
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    backgroundColor: "#538bdb",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    height: scale(53),
    borderRadius: scale(15),
    width: "120%",
    minHeight: "30%",
    // paddingRight: 10,
    paddingTop: -10,
    fontSize: "2rem",
  },
  titleText: {
    textAlign: "center",
    fontFamily: "PermanentMarker_400Regular",
    color: "#F0EEEB",
    fontSize: scale(17),
    marginTop: scale(20),
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
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 10,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 10,
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
  OKbutton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
    marginTop: scale(20),
    marginBottom: scale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  OKbuttonPressed: {
    backgroundColor: "#538dbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
    marginTop: scale(20),
    marginBottom: scale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
});
