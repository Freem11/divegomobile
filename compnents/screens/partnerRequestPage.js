import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  activeFonts,
  colors,
  fontSizes,
  buttonText,
  authenicationButton,
} from "../styles";
import { createPartnerAccountRequest } from "../../supabaseCalls/partnerSupabaseCalls";
import TextInputField from "../authentication/utils/textInput";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import { useTranslation } from "react-i18next";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PartnerRequestPage() {
  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { profile } = useContext(UserProfileContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { t } = useTranslation();
  useEffect(() => {
    setFormVals({ ...formVals, UserId: profile[0].UserID });
  }, []);

  const [formVals, setFormVals] = useState({
    businessName: "",
    websiteLink: "",
    latitude: null,
    lontitude: null,
    UserId: null,
  });

  const handleSubmit = () => {
    if (
      formVals.websiteLink === "" ||
      formVals.businessName === "" ||
      formVals.latitude == "" ||
      isNaN(formVals.latitude) ||
      formVals.lontitude == "" ||
      isNaN(formVals.lontitude)
    ) {
      setConfirmationType("Partner Account Creation Request");
      setActiveConfirmationID("ConfirmationCaution");
      setConfirmationModal(true);
      return;
    } else {
      createPartnerAccountRequest(formVals);
      setConfirmationType("Partner Account Creation Request");
      setActiveConfirmationID("ConfirmationSuccess");
      setConfirmationModal(true);
      setFormVals({
        ...formVals,
        websiteLink: "",
        businessName: "",
        latitude: null,
        lontitude: null,
      });
      setLevelTwoScreen(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={styles.container}>
        <MaterialIcons
          name="chevron-left"
          size={moderateScale(48)}
          color={"darkgrey"}
          onPress={() => setLevelTwoScreen(false)}
          style={{
            marginTop: "15%",
            alignSelf: "flex-start",
            marginLeft: "2%",
          }}
        />
        <View style={styles.content}>
          <Text style={styles.header}>
            {t('PartnerRequestPage.header')}
          </Text>

          <Text style={styles.expliainer}>
            {t('PartnerRequestPage.explanation')}
          </Text>
          <View style={{ marginTop: windowWidth > 600 ? "5%" : "10%" }}>
            <TextInputField
              icon={"store"}
              placeHolderText={t('PartnerRequestPage.businessPlaceholder')}
              secure={false}
              onChangeText={(text) =>
                setFormVals({ ...formVals, businessName: text })
              }
            />
            <Text style={styles.infos}>
              {t('PartnerRequestPage.businessExplainer')}
            </Text>
          </View>

          <View style={{ marginTop: moderateScale(30) }}>
            <TextInputField
              icon={"web"}
              placeHolderText={t('PartnerRequestPage.websitePlaceholder')}
              onChangeText={(text) =>
                setFormVals({ ...formVals, websiteLink: text })
              }
            />
            <Text style={styles.infos}>
              {t('PartnerRequestPage.websiteExplainer')}
            </Text>
          </View>

          <View style={{ marginTop: moderateScale(30) }}>
            <TextInputField
              icon={"latitude"}
              placeHolderText={t('PartnerRequestPage.latPlaceholder')}
              vectorIcon={"MaterialCommunityIcons"}
              keyboardConfig="number-pad"
              onChangeText={(text) =>
                setFormVals({ ...formVals, latitude: text })
              }
            />
          </View>

          <View style={{ marginTop: moderateScale(30) }}>
            <TextInputField
              icon={"longitude"}
              placeHolderText={t('PartnerRequestPage.lngPlaceholder')}
              vectorIcon={"MaterialCommunityIcons"}
              keyboardConfig="number-pad"
              onChangeText={(text) =>
                setFormVals({ ...formVals, lontitude: text })
              }
            />
            <Text style={styles.infos}>
              {t('PartnerRequestPage.latLngExplainer')}
            </Text>
          </View>

          <View style={styles.buttonBox}>
            <TouchableWithoutFeedback onPress={() => handleSubmit()}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>
                  {t('PartnerRequestPage.submitButton')}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={30}
                  color={colors.themeWhite}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: windowWidth,
    height: windowHeight,
    // backgroundColor: "pink",
  },
  content: {
    marginHorizontal: "12%",
  },
  header: {
    zIndex: 10,
    marginTop: "5%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Bold,
    color: "darkgrey",
  },
  expliainer: {
    marginTop: windowWidth > 600 ? "5%" : "10%",
    textAlign: "center",
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Bold,
    color: colors.primaryBlue,
  },
  infos: {
    marginTop: "1%",
    textAlign: "center",
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
  },
  buttonBox: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: "-10%",
  },
  loginButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 10 },
  ],
  loginText: [buttonText, { marginHorizontal: moderateScale(5) }],
});
