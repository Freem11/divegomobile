import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  let blurb = null;
  switch (confirmationType) {
    case "Sea Creature Submission":
    case "Dive Site":
    case "Trip Edit":
    case "Trip Delete":
      blurb = t("ConfirmSuccessModal.allow24HoursToProcess");
      break;
    case "Trip Submission":
      blurb = t("ConfirmSuccessModal.checkOpeningBlurb");
      break;
    case "Partner Account Creation Request":
      blurb = t("ConfirmSuccessModal.waitTillProccessOrBeContacted");
      break;
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>
          {t("ConfirmSuccessModal.cannotComplete", { confirmationType: confirmationType })}
        </Text>
        <Text style={styles.text2}>{blurb}</Text>

        <TouchableWithoutFeedback onPress={tidyUp}>
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>{t('Common.ok')}</Text>
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
