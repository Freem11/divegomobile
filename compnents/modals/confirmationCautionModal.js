import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { moderateScale, scale } from "react-native-size-matters";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";

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
        "The Image has not yet completed processing, please wait for the indicator to turn green, which indicates that it is ready, and try again.";
      break;
    case "Dive Site":
      blurb =
        "Your dive site submission is still missing required information, please make changes and when the indicator to turns green your submission will be ready to submit.";
      break;
    case "Partner Account Creation Request":
      blurb =
        "Your request is still missing required information, please ensure that you fill out any fields highlighted in pink to sucessfully complete your request.";
      break;
    case "Trip Edit":
      blurb = "Trip edit request is still missing required information, please ensure that you fill out any fields highlighted in pink to sucessfully complete it.";
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>
          Your {confirmationType} cannot be completed just yet.
        </Text>
        <Text style={styles.text2}>{blurb}</Text>

        <View
          style={{
            marginLeft: moderateScale(0),
            marginBottom: moderateScale(20),
          }}
        >
          <ModalSecondaryButton
            buttonAction={tidyUp}
            icon={null}
            buttonText={"Cancel"}
            altStyle={true}
          />
        </View>
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
  text: {
    fontSize: moderateScale(20),
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "0%",
    margin: scale(10),
  },
  text2: {
    fontSize: moderateScale(18),
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "5%",
    marginBottom: "7%",
    margin: scale(35),
  },
});
