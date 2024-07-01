import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { moderateScale, scale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";

export default function SuccessModal(props) {
  const {
    submissionItem,
    toggleDiveModal,
    togglePicModal,
    confirmationSucessClose,
    itterator2,
    setItterator2,
    itterator3,
    setItterator3,
    setPartnerModal
  } = props;

  const [profileCloseState, setProfileCloseState] = useState(false);

  const tidyUp = () => {
    if (submissionItem === "dive site") {
      toggleDiveModal();
      if (itterator2 > 0) {
        setItterator2(itterator2 + 1);
      }
    } else if (submissionItem === "sea creature submission") {
      togglePicModal();
      if (itterator3 > 0) {
        setItterator3(itterator3 + 1);
      }
    } else if (submissionItem === "partner account creation request") {
      setPartnerModal(false)
    }

    confirmationSucessClose();
  };

  let blurb = null;
  if (submissionItem === "partner account creation request") {
    blurb =
      `We are reviewing your submission. Please allow up to 24 hours for it to be reviewed and approved. \n \n We may contact you if we need to confirm any discrepancies.`;
  } else {
    blurb = "Please allow up to 24 hours for it to be reviewed and approved."
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>
          Your {submissionItem} was successully submitted!
        </Text>
        <Text style={styles.text2}>
          {blurb}
        </Text>

        <View style={{ marginRight: "24%", marginBottom: moderateScale(20) }}>
          <ModalSecondaryButton
            buttonAction={tidyUp}
            icon={null}
            buttonText={"Ok"}
            altStyle={false}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#99edc3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "0%",
    margin: scale(10),
  },
  text2: {
    fontSize: 18,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "5%",
    marginBottom: "7%",
    margin: scale(35),
  },
  OKbutton: {
    backgroundColor: "#79bace",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.55,
    shadowRadius: 6.27,

    elevation: 10,
  },
  OKbuttonPressed: {
    opacity: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: scale(35),
    width: scale(150),
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
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
