import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
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
import screenData from "./screenData.json";
import TextInputField from "../authentication/textInput";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../../compnents/contexts/userProfileContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PartnerRequestPage(props) {
  const {
    title,
    emailPlaceholder,
    passwordPlaceholder,
    buttonText,
    promptText,
    promptLinkText,
    moveToLandingPage,
    moveToSignUpPage,
    loginFail,
    setLoginFail,
  } = props;

  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { profile } = useContext(UserProfileContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

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

  const handleSubmit = (formValues) => {
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
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
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
            {screenData.PartnerRequestPage.header}
          </Text>

          <Text style={styles.expliainer}>
            {screenData.PartnerRequestPage.explanation}
          </Text>
          <View style={{ marginTop: windowWidth > 600 ? "5%" : "10%" }}>
            <TextInputField
              icon={"store"}
              placeHolderText={
                screenData.PartnerRequestPage.businessPlaceholder
              }
              secure={false}
              onChangeText={(text) =>
                setFormVals({ ...formVals, businessName: text })
              }
            />
            <Text style={styles.infos}>
              {screenData.PartnerRequestPage.businessExplainer}
            </Text>
          </View>

          <View style={{ marginTop: moderateScale(30) }}>
            <TextInputField
              icon={"web"}
              placeHolderText={screenData.PartnerRequestPage.websitePlaceholder}
              onChangeText={(text) =>
                setFormVals({ ...formVals, websiteLink: text })
              }
            />
            <Text style={styles.infos}>
              {screenData.PartnerRequestPage.websiteExplainer}
            </Text>
          </View>

          <View style={{ marginTop: moderateScale(30) }}>
            <TextInputField
              icon={"latitude"}
              placeHolderText={screenData.PartnerRequestPage.latPlaceholder}
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
              placeHolderText={screenData.PartnerRequestPage.lngPlaceholder}
              vectorIcon={"MaterialCommunityIcons"}
              keyboardConfig="number-pad"
              onChangeText={(text) =>
                setFormVals({ ...formVals, lontitude: text })
              }
            />
            <Text style={styles.infos}>
              {screenData.PartnerRequestPage.latLngExplainer}
            </Text>
          </View>

          <View style={styles.buttonBox}>
            <TouchableWithoutFeedback onPress={() => handleSubmit()}>
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>
                  {screenData.PartnerRequestPage.submitButton}
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
      </View>
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
    color: "darkgrey",
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
  promtBox: {
    position: "absolute",
    bottom: moderateScale(10),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  promptText: {
    fontSize: moderateScale(15),
    fontFamily: activeFonts.Italic,
    color: colors.themeBlack,
  },
  promptLinkText: {
    marginTop: moderateScale(1),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.thin,
    color: colors.primaryBlue,
  },
  loginButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 10 },
  ],
  loginText: [buttonText, { marginHorizontal: moderateScale(5) }],
  erroMsg: {
    minHeight: moderateScale(34),
    marginTop: moderateScale(15),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
  },
  erroMsgEmpty: {
    height: moderateScale(34),
    marginTop: moderateScale(15),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
  },
});
