import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { scale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import { IterratorContext } from "../contexts/iterratorContext";
import { SessionContext } from "../contexts/sessionContext";
import { PinContext } from "../contexts/staticPinContext";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";

let userVar = false;

export default function UserNamer(props) {
  const { nameChangerState, setNameChangerState, currentUserName } = props;
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { pinValues, setPinValues } = useContext(PinContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

  const { itterator, setItterator } = useContext(IterratorContext);
  const [userFail, setUserFail] = useState(null);
  const [subButState, setSubButState] = useState(false);
  const [cancelButState, setCancelButState] = useState(false);

  const [formVal, setFormVal] = useState({
    userName: "",
  });

  const [formValidation, SetFormValidation] = useState({
    userName: "",
  });

  const handleSubmit = async () => {
    Keyboard.dismiss();
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
      // let sessionUserId = 'a93f6831-15b3-4005-b5d2-0e5aefcbda13';
      // console.log(sessionUserId, formVal.userName);
      try {
        const success = await updateProfile({
          id: sessionUserId,
          username: formVal.userName,
        });
        if(nameChangerState){
          setNameChangerState(false);
        }
        if (success.length > 0) {
          setItterator(itterator + 1);
          setFormVal({ userName: "" });
          if(Array.isArray(success)){
            setProfile(success);
          }else {
            setProfile([success]);
          }
          setPinValues({
            ...pinValues,
            UserId: success[0].UserID,
            UserName: success[0].UserName,
          });
          setAddSiteVals({
            ...addSiteVals,
            UserID: success[0].UserID,
            UserName: success[0].UserName,
          });
        } else {
          setUserFail("Sorry that username has already been taken");
        }
      } catch (e) {
        setUserFail("Sorry that username has already been taken");
        console.log({ title: "Error", message: e.message });
      }
    }
  };

  const handleCancel = async () => {
    Keyboard.dismiss();
    setNameChangerState(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {nameChangerState ? "New Diver Name?" : "What is your diver name?"}
      </Text>
      <InsetShadow
        containerStyle={{
          borderRadius: 25,
          height: 40,
          width: 200,
          marginLeft: 0,
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
          fontSize={16}
          placeholderTextColor="darkgrey"
          color={formValidation.userName ? "black" : "#F0EEEB"}
          onChangeText={(InputText) =>
            setFormVal({ ...formVal, userName: InputText })
          }
          onFocus={() => setUserFail(null)}
          onPress={() => setUserFail(null)}
        ></TextInput>
      </InsetShadow>

      {userFail && <Text style={styles.erroMsg}>{userFail}</Text>}

      <View style={{flexDirection:"row", justifyContent: "space-between", width: "94%", marginTop: 10, marginBottom: 20}}>
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
                fontFamily: "PatrickHand_400Regular",
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
        {nameChangerState &&
        <View
          style={
            cancelButState ? styles.cancelButtonPressed : styles.cancelButton
          }
        >
          <TouchableWithoutFeedback
            onPress={handleCancel}
            onPressIn={() => setCancelButState(true)}
            onPressOut={() => setCancelButState(false)}
          >
            <Text
              style={{
                color: "#538bdb",
                fontSize: 17,
                marginTop: 0,
                fontFamily: "PatrickHand_400Regular",
                width: "100%",
                alignSelf: "center",
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              Cancel
            </Text>
          </TouchableWithoutFeedback>
        </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    backgroundColor: "#538bdb",
    // backgroundColor: "pink",
    opacity: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    bottom: 0,
    left: 0,
    // height: scale(53),
    borderRadius: scale(15),
    borderColor: "darkgrey",
    borderWidth: 1,
    minHeight: "30%",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: scale(-10),
    fontSize: "2rem",
  },
  titleText: {
    textAlign: "center",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: scale(26),
    marginTop: scale(20),
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538dbd",
    borderRadius: 10,
    width: scale(200),
    height: 40,
    alignSelf: "center",
    marginBottom: scale(20),
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
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: scale(200),
    height: 40,
    alignSelf: "center",
    marginBottom: scale(20),
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
    fontFamily: "Itim_400Regular",
    fontSize: 14,
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
    height: scale(25),
    width: scale(100),
    // marginLeft: "30%",
    marginTop: scale(10),
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
    height: scale(25),
    width: scale(100),
    // marginLeft: "30%",
    marginTop: scale(10),
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
  cancelButton: {
    backgroundColor: "pink",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: scale(25),
    width: scale(100),
    // marginLeft: "30%",
    marginTop: scale(10),
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
  cancelButtonPressed: {
    backgroundColor: "pink",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: scale(25),
    width: scale(100),
    // marginLeft: "30%",
    marginTop: scale(10),
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
