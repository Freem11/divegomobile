import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React, { useContext } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import {
  activeFonts,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
} from "../styles";

export default function SuccessModal() {
  const { confirmationType } = useContext(ConfirmationTypeContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);

  const tidyUp = () => {
    setConfirmationModal(false);
  };

  let blurb = null;
  switch (confirmationType) {
    case "Trip Submission":
      blurb = "Check it by opening up your dive center on the map.";
      break;
    case "Sea Creature Submission":
      blurb = "Please allow up to 24 hours for it to be reviewed and approved.";
      break;
    case "Dive Site":
      blurb = "Please allow up to 24 hours for it to be reviewed and approved.";
      break;
    case "Partner Account Creation Request":
      blurb = `We are reviewing your submission. Please allow up to 24 hours for it to be reviewed and approved. \n \n We may contact you if we need to confirm any discrepancies.`;
      break;
    case "Trip Edit":
      blurb = "Please allow up to 24 hours for it to be reviewed and approved.";
      break;
    case "Trip Delete":
      blurb = "Please allow up to 24 hours for it to be reviewed and approved.";
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>
          Your {confirmationType} was successully submitted!
        </Text>
        <Text style={styles.text2}>{blurb}</Text>

        <TouchableWithoutFeedback onPress={tidyUp}>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>OK</Text>
          </View>
        </TouchableWithoutFeedback>
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
  confirmButton: [screenSecondaryButton],
  confirmButtonText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
  text: {
    fontSize: moderateScale(fontSizes.StandardText),
    color: "#36454F",
    fontFamily: activeFonts.Regular,
    alignSelf: "center",
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "0%",
    margin: scale(10),
  },
  text2: {
    fontSize: moderateScale(fontSizes.SmallText),
    color: "#36454F",
    fontFamily: activeFonts.Regular,
    alignSelf: "center",
    textAlign: "center",
    marginTop: "5%",
    marginBottom: "7%",
    margin: scale(35),
  },
});
