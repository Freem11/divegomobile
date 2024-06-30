import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { moderateScale } from "react-native-size-matters";
import ModalSecondaryButton from "./modalSecondaryButton";
import ModalTertiaryButton from "./modalTertiaryButton";
import CloseButton from "./closeButton";

export default function ModalHeader(props) {
  const { titleText, subText, onClose, altButton, icon, tertButton } = props;

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
      <Text style={styles.titleText}>{titleText}</Text>
      <Text style={styles.subText}>{subText}</Text>
      </View>
      <View style={styles.altButton}>
        {tertButton && <ModalTertiaryButton tertButton={tertButton}/>}
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
  titleBox: {
    width: "60%",
  },
  titleText: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: moderateScale(28),
    // backgroundColor: "pink",
  },
  subText: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: moderateScale(12),
    // backgroundColor: "pink",
  },
  altButton: {
    flexDirection: "row",
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
  },
  closeButton: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
  },
});
