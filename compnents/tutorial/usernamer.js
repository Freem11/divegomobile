import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, Keyboard, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { IterratorContext } from "../contexts/iterratorContext";
import { SessionContext } from "../contexts/sessionContext";
import { PinContext } from "../contexts/staticPinContext";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";
import InputField from "../reusables/textInputs";

let userVar = false;
const windowWidth = Dimensions.get("window").width;

export default function UserNamer(props) {
  const { nameChangerState, setNameChangerState, currentUserName } = props;
  const { activeSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const { pinValues, setPinValues } = useContext(PinContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

  const { itterator, setItterator } = useContext(IterratorContext);
  const [userFail, setUserFail] = useState("");

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
        if (nameChangerState) {
          setNameChangerState(false);
        }
        if (success.length > 0) {
          setItterator(itterator + 1);
          setFormVal({ userName: "" });
          if (Array.isArray(success)) {
            setProfile(success);
          } else {
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
        console.log({ title: "Error18", message: e.message });
      }
    }
  };

  const handleText = async (text) => {
    setFormVal({ ...formVal, userName: text });
    setUserFail("");
    SetFormValidation({
      ...formValidation,
      userName: false,
    });
  };

  const handleCancel = async () => {
    Keyboard.dismiss();
    setNameChangerState(false);
    setFormVal({ ...formVal, userName: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {nameChangerState ? "New Diver Name?" : "What is your diver name?"}
      </Text>
      <InputField
        validationItem={formValidation.userName}
        placeHolderText={"Diver Name"}
        inputValue={formVal.userName}
        keyboardType={"default"}
        onChangeText={(text) => handleText(text)}
      />
      {userFail && <Text style={styles.erroMsg}>{userFail}</Text>}

      {nameChangerState && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            marginTop: moderateScale(10),
            marginBottom: moderateScale(20),
          }}
        >
          <ModalSecondaryButton
            buttonAction={handleSubmit}
            icon={null}
            buttonText={"Ok"}
          />

          <ModalSecondaryButton
            buttonAction={handleCancel}
            icon={null}
            buttonText={"Cancel"}
            altStyle={true}
          />
        </View>
      )}

      {!nameChangerState && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            marginTop: moderateScale(10),
            marginBottom: moderateScale(20),
            marginLeft: moderateScale(20),
          }}
        >
          <ModalSecondaryButton
            buttonAction={handleSubmit}
            icon={null}
            buttonText={"Ok"}
          />
        </View>
      )}
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
    borderRadius: moderateScale(15),
    borderColor: "darkgrey",
    borderWidth: 1,
    minHeight: "30%",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: moderateScale(-10),
    fontSize: "2rem",
  },
  titleText: {
    textAlign: "center",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: moderateScale(28),
    marginTop: moderateScale(20),
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
    marginTop: moderateScale(20),
  },
});
