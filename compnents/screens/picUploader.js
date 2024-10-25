import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import screenData from "./screenData.json";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import WavyHeaderUploader from "./wavyHeaderUploader";
import TextInputField from "../authentication/textInput";
import AnimalAutoSuggest from "../autoSuggest/autoSuggest";
import {
  activeFonts,
  colors,
  fontSizes,
  authenicationButton,
  buttonText,
} from "../styles";
import { moderateScale } from "react-native-size-matters";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { PinContext } from "../contexts/staticPinContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { MaterialIcons } from "@expo/vector-icons";
import { insertPhotoWaits } from "../../supabaseCalls/photoWaitSupabaseCalls";
import {
  uploadphoto,
  removePhoto,
} from "../cloudflareBucketCalls/cloudflareAWSCalls";
import { chooseImageHandler } from "./imageUploadHelpers";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PicUploader(props) {
  const {} = props;
  const { profile } = useContext(UserProfileContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDatePickerConfirm = (passedDate) => {
    let formattedDate = moment(passedDate).format("YYYY-MM-DD");
    if (passedDate > date) return;

    setPinValues({ ...pinValues, PicDate: formattedDate });
    hideDatePicker();
  };

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {
        let uri = image.assets[0].uri;
        let extension = image.assets[0].uri.split(".").pop();
        const fileName = Date.now() + "." + extension;

        //create new photo file and upload
        let picture = await fetch(uri);
        picture = await picture.blob();
        await uploadphoto(picture, fileName);
        if (pinValues.PicFile !== null || pinValues.PicFile === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: pinValues.PicFile.split("/").pop(),
          });
        }

        setPinValues({
          ...pinValues,
          PicFile: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  const onSubmit = async () => {
    if (
      pinValues.PicFile &&
      pinValues.PicDate.length > 0 &&
      pinValues.Animal.length > 0
    ) {
      insertPhotoWaits(pinValues);
      setPinValues({
        ...pinValues,
        PicFile: null,
        Animal: "",
        PicDate: "",
        Latitude: "",
        Longitude: "",
        DDVal: "0",
      });
      setConfirmationType("Sea Creature Submission");
      setActiveConfirmationID("ConfirmationSuccess");
      setConfirmationModal(true);
    } else {
      setActiveConfirmationID("ConfirmationCaution");
      setConfirmationModal(true);
    }
  };

  const onClose = async () => {
    if (pinValues.PicFile !== null || pinValues.PicFile === "") {
      await removePhoto({
        filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
        fileName: pinValues.PicFile.split("/").pop(),
      });
    }
    setLevelTwoScreen(false);
    setPinValues({
      ...pinValues,
      PicFile: null,
      Animal: "",
      PicDate: "",
      Latitude: "",
      Longitude: "",
      DDVal: "0",
    });
  };

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={colors.themeWhite}
        onPress={() => onClose()}
        style={styles.backButton}
      />
      {pinValues.PicFile ? (
        <View style={styles.addPhotoButton}>
          <MaterialIcons
            name="add-a-photo"
            size={moderateScale(30)}
            color={colors.themeWhite}
            onPress={() => handleImageUpload()}
          />
        </View>
      ) : null}
      <View style={styles.contentContainer}>
        <Text style={styles.header}>{screenData.PicUploader.header}</Text>
        <View
          style={{
            marginBottom: windowHeight / 70,
            width: windowWidth * 0.75,
            alignItems: "center",
          }}
        >
          <View style={styles.textBuffer}>
            <Text style={styles.label}>{screenData.PicUploader.whatLabel}</Text>
            <AnimalAutoSuggest
              pinValues={pinValues}
              setPinValues={setPinValues}
              inputValue={pinValues.Animal}
              icon={"shark"}
              placeHolderText={screenData.PicUploader.whatPlaceholder}
              secure={false}
              vectorIcon={"MaterialCommunityIcons"}
            />
          </View>
          <View style={styles.textBuffer}>
            <Text style={styles.label}>{screenData.PicUploader.whenLabel}</Text>
            <Toucher onPress={() => showDatePicker()}>
              <View pointerEvents="none">
                <TextInputField
                  icon={"calendar-month-outline"}
                  inputValue={pinValues.PicDate}
                  placeHolderText={screenData.PicUploader.whenPlaceholder}
                  secure={false}
                  vectorIcon={"MaterialCommunityIcons"}
                />
              </View>
            </Toucher>
          </View>
          <View style={styles.textBuffer}>
        <Text style={styles.label}>{screenData.PicUploader.whereLabel}</Text>
            <TextInputField
              icon={"anchor"}
              inputValue={pinValues.siteName}
              placeHolderText={screenData.PicUploader.wherePlaceholder}
              secure={false}
            />
          </View>
        </View>

        <View style={styles.buttonBox}>
          <TouchableWithoutFeedback onPress={() => onSubmit()}>
            <View style={styles.submitButton}>
        <Text style={styles.submitText}>{screenData.PicUploader.submitButton}</Text>
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

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
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
  addPhotoButton: [
    { zIndex: 50, position: "absolute", top: "32%", right: "5%" },
  ],
  backButton: [{ zIndex: 50, position: "absolute", top: "5.5%", left: "2%" }],
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
    zIndex: -1,
    marginVertical: "5%",
    marginHorizontal: "5%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
    alignSelf: "flex-start",
  },
  label: {
    marginLeft: "-5%",
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.LightItalic,
  },
  textBuffer: {
    marginBottom: moderateScale(20),
  },
  buttonBox: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: windowWidth > 600 ? "-15%" : "-20%",
    marginRight: "15%",
  },
  submitButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 10 },
  ],
  submitText: [buttonText, { marginHorizontal: moderateScale(5) }],
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
});
