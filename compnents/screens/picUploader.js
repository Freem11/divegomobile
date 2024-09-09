import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import WavyHeaderUploader from "./wavyHeaderUploader";
import TextInputField from "../authentication/textInput";
import CloseButton from "../reusables/closeButton";
import { activeFonts, colors, fontSizes, authenicationButton, buttonText } from "../styles";
import { moderateScale } from "react-native-size-matters";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";

import { PinContext } from "../contexts/staticPinContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";
import { MaterialIcons } from "@expo/vector-icons";
import {
  removePhoto,
} from "../cloudflareBucketCalls/cloudflareAWSCalls";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PicUploader(props) {
  const {} = props;
  const { profile } = useContext(UserProfileContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const [userFail, setUserFail] = useState("");
  const [tempUserName, setTempUserName] = useState("");

  const onSubmit = async () => {
    if(pinValues.PicFile && pinValues.PicDate.length > 0 && pinValues.Animal.length > 0){
      console.log("yay!")
    } else {
      console.log("boo!")
    }

  };

  const onClose = async() => {
    if (
      pinValues.PicFile !== null ||
      pinValues.PicFile === ""
    ) {
      await removePhoto({
        filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
        fileName: pinValues.PicFile.split("/").pop(),
      });
    }
    setLevelTwoScreen(false);
  };

  console.log("THESE", pinValues)

  return (
    <View style={styles.container}>
      <View style={styles.screenCloseButton}>
        <CloseButton onClose={() => onClose()} />
      </View>
      <View style={styles.contentContainer}>

        <Text style={styles.header}>
          Your Sea Creature Sighting</Text>
        <View
          style={{
            marginBottom: windowHeight / 70,
            width: windowWidth * 0.75,
            alignItems: "center",
          }}
        >
          <View style={styles.textBuffer}>
            <Text style={styles.label}>What you saw</Text>
            <TextInputField
              icon={"shark"}
              inputValue={pinValues.Animal}
              placeHolderText={"Sea Life Encountered"}
              secure={false}
              vectorIcon={"MaterialCommunityIcons"}
              // onChangeText={(nameText) =>
              //   setProfileVals({ ...pi, userName: nameText })
              // }
            />
          </View>
          <View style={styles.textBuffer}>
          <Text style={styles.label}>When you saw it</Text>
            <TextInputField
              icon={"calendar-month-outline"}
              inputValue={pinValues.Animal}
              placeHolderText={"Date of Sighting"}
              secure={false}
              vectorIcon={"MaterialCommunityIcons"}
              // onChangeText={(nameText) =>
              //   setProfileVals({ ...pi, userName: nameText })
              // }
            />
          </View>
          <View style={styles.textBuffer}>
          <Text style={styles.label}>Where you saw it</Text>
            <TextInputField
              icon={"anchor"}
              inputValue={pinValues.siteName}
              placeHolderText={"Location of Sighting"}
              secure={false}
              // onChangeText={(nameText) =>
              //   setProfileVals({ ...pi, userName: nameText })
              // }
            />
          </View>

          {userFail.length > 0 ? (
            <Text style={styles.erroMsg}>{userFail}</Text>
          ) : (
            <View style={styles.erroMsgEmpty}></View>
          )}
        </View>


        <View style={styles.buttonBox}>
          <TouchableWithoutFeedback
            onPress={() => onSubmit()}
          >
            <View style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
              <MaterialIcons
                name="chevron-right"
                size={30}
                color={colors.themeWhite}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
     
      </View>

      <WavyHeaderUploader
        customStyles={styles.svgCurve}
        image={pinValues.PicFile}
        setPinValues={setPinValues}
        pinValues={pinValues}
      ></WavyHeaderUploader>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight,
  },
  contentContainer: {
    alignItems: "left",
    zIndex: 15,
    position: "absolute",
    top: 0,
    left: 0,
    marginTop: Platform.OS === "ios" ? windowHeight / 2.4 : windowHeight / 2.2,
    width: "100%",
    alignItems: "center",
  },
  header: {
    zIndex: 10,
    marginVertical: "8%",
    marginHorizontal: "5%",
    fontSize: fontSizes.Header,
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
    alignSelf: "flex-start"
  },
  label: {
    marginLeft: "-5%",
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.LightItalic
  },
  textBuffer: {
    marginBottom: moderateScale(20),
  },
  buttonBox: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: "-15%",
    marginRight: "15%"
  },
  submitButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 10 },
  ],
  submitText: [buttonText, { marginHorizontal: moderateScale(5) }],
  screenCloseButton: [
    { zIndex: 50, position: "absolute", top: "5%", right: "5%" },
  ],
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
  erroMsg: {
    minHeight: moderateScale(34),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
    marginHorizontal: "10%",
    marginTop: "1%",
  },
  erroMsgEmpty: {
    // height: moderateScale(34),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
    marginHorizontal: "10%",
    marginTop: "1%",
  },
});
