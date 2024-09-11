import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  activeFonts,
  colors,
  fontSizes,
  buttonText,
  authenicationButton,
} from "../styles";
import screenData from "./screenData.json";
import TextInputField from '../authentication/textInput';
import { MaterialIcons } from "@expo/vector-icons";
import { handleLogInSubmit } from "../helpers/loginHelpers";
import { moderateScale } from "react-native-size-matters";
import { SessionContext } from "../contexts/sessionContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";

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
    setLoginFail
  } = props;

  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );

  const [formVals, setFormVals] = useState({
    email: "",
    password: "",
  });

  const { setActiveSession } = useContext(SessionContext);
  const [secureTextEntry, setSecureTextEntry] = useState(true);


  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={"darkgrey"}
        onPress={() => setLevelTwoScreen(false)}
        style={{ marginTop: "15%", alignSelf: "flex-start", marginLeft: "2%" }}
     
      />
      <View style={styles.content}>
        <Text style={styles.header}>{screenData.PartnerRequestPage.header}</Text>

        <View style={{ marginTop: moderateScale(60) }}>
          <TextInputField
            icon={"store"}
            placeHolderText={screenData.PartnerRequestPage.businessPlaceholder}
            secure={false}
            onChangeText={(text) => setFormVals({ ...formVals, email: text })}
          />
        </View>

        <View style={{ marginTop: moderateScale(40) }}>
          <TextInputField
            icon={"web"}
            placeHolderText={screenData.PartnerRequestPage.websitePlaceholder}
            setSecureTextEntry={setSecureTextEntry}
            secure={secureTextEntry}
            onChangeText={(text) =>
              setFormVals({ ...formVals, password: text })
            }
          />
        </View>


        <View style={{ marginTop: moderateScale(40) }}>
          <TextInputField
            icon={"latitude"}
            placeHolderText={screenData.PartnerRequestPage.latPlaceholder}
            setSecureTextEntry={setSecureTextEntry}
            secure={secureTextEntry}
            vectorIcon={"MaterialCommunityIcons"}
            onChangeText={(text) =>
              setFormVals({ ...formVals, password: text })
            }
          />
        </View>


        <View style={{ marginTop: moderateScale(40) }}>
          <TextInputField
            icon={"longitude"}
            placeHolderText={screenData.PartnerRequestPage.lngPlaceholder}
            setSecureTextEntry={setSecureTextEntry}
            secure={secureTextEntry}
            vectorIcon={"MaterialCommunityIcons"}
            onChangeText={(text) =>
              setFormVals({ ...formVals, password: text })
            }
          />
        </View>

        {loginFail ? (
          <Text style={styles.erroMsg}>{loginFail}</Text>
        ) : (
          <View style={styles.erroMsgEmpty}></View>
        )}

        <View style={styles.buttonBox}>
          <TouchableWithoutFeedback
            onPress={() => null}
          >
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>{screenData.PartnerRequestPage.submitButton}</Text>
              <MaterialIcons
                name="chevron-right"
                size={30}
                color={colors.themeWhite}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.promtBox}>
        <Text style={styles.promptText}>{promptText} </Text>
        <TouchableWithoutFeedback onPress={() => moveToSignUpPage()}>
          <Text style={styles.promptLinkText}>{promptLinkText}</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
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
    marginTop: "10%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Bold,
    color: "darkgrey",
  },
  buttonBox: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: moderateScale(-50)
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
  }
});
