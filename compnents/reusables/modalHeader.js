import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { moderateScale } from "react-native-size-matters";
import ModalSecondaryButton from "./modalSecondaryButton";
import CloseButton from "./closeButton";

export default function ModalHeader(props) {
  const { titleText, onClose, altButton, icon } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{titleText}</Text>
      <View style={styles.altButton}>
        {icon ? (
          <ModalSecondaryButton buttonAction={altButton} icon={icon} />
        ) : null}
      </View>
      <View style={styles.closeButton}>
        <CloseButton onClose={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1%",
    marginTop: "2%",
    marginLeft: "3%",
    width: "94%",
    borderRadius: 10,
    overflow: "hidden",
    // backgroundColor: "pink"
  },
  titleText: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: moderateScale(28),
    width: "60%",
  },
  altButton: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
});
