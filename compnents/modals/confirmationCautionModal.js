import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { moderateScale, scale } from "react-native-size-matters";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";

export default function FailModal(props) {
  const { submissionItem, confirmationFailClose } = props;

  const tidyUp = () => {
    confirmationFailClose();
  };

  let blurb = null;
  if (submissionItem === "sea creature submission") {
    blurb =
      "The Image has not yet completed processing, please wait for the indicator to turn green, which indicates that it is ready, and try again.";
  } else if (submissionItem === "dive site") {
    blurb =
      "Your dive site submission is still missing required information, please make changes and when the indicator to turns green your submission will be ready to submit.";
  } else if (submissionItem === "partner account creation request") {
    blurb =
      "Your request is still missing required information, please ensure that you fill out any fields highlighted in pink to sucessfully complete your request.";
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>
          Your {submissionItem} cannot be completed just yet.
        </Text>
        <Text style={styles.text2}>{blurb}</Text>

        <View style={{ marginRight: "24%", marginBottom: moderateScale(20) }}>
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
});
