import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import ModalSecondaryButton from "./modalSecondaryButton";
import ModalTertiaryButton from "./modalTertiaryButton";
import CloseButton from "./closeButton";

const windowWidth = Dimensions.get("window").width;

export default function ModalHeader(props) {
  const { titleText, subText, onClose, altButton, icon, tertButton } = props;

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>{titleText}</Text>
        {subText && <Text style={styles.subText}>{subText}</Text>}
      </View>
      <View style={styles.altButton}>
        {tertButton && <ModalTertiaryButton tertButton={tertButton} />}
        {altButton && icon && <ModalSecondaryButton buttonAction={altButton} icon={icon} />}
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
    minHeight: moderateScale(50),
    width: "92%",
    borderRadius: 10,
    overflow: "hidden",
    // backgroundColor: "orange"
  },
  titleBox: {
    width: "120%",
    // backgroundColor: "purple"
  },
  titleText: {
    width:"50%",
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: moderateScale(24),
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
    position: "absolute",
    right: windowWidth > 600 ? moderateScale(0) : moderateScale(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    // backgroundColor: "green",
  },
});
