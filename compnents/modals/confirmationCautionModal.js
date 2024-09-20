import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React, { useContext } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import {
  activeFonts,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
} from "../styles";
export default function FailModal(props) {
  const { confirmationType } = useContext(ConfirmationTypeContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const tidyUp = () => {
    setConfirmationModal(false);
  };

  let blurb = null;
  switch (confirmationType) {
    case "Trip Submission":
      blurb =
        "Trip Submission is still missing required information, please ensure that you fill out any fields highlighted in pink to sucessfully complete it.";
      break;
    case "Sea Creature Submission":
      blurb =
        "In order to sucessfully submit your sea creature sighting, please provide a photo as well as the name of the species of sea creature in the photo as well as the date it was photographed. \n \n Note: The location will be automatically assumed to be the dive site you opened this page from.";
      break;
    case "Dive Site":
      blurb =
        "Your dive site submission is still missing required information, please make changes and when the indicator to turns green your submission will be ready to submit.";
      break;
    case "Partner Account Creation Request":
      blurb =
        "Your request is still missing required information, please ensure that you fill out all four fields to sucessfully complete your request.";
      break;
    case "Trip Edit":
      blurb =
        "Trip edit request is still missing required information, please ensure that you fill out any fields highlighted in pink to sucessfully complete it.";
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>
          Your {confirmationType} cannot be completed just yet.
        </Text>
        <Text style={styles.text2}>{blurb}</Text>

        <TouchableWithoutFeedback onPress={tidyUp}>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
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
