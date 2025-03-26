import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import screenData from "../screenData.json";
import WavyHeaderDynamic from "../wavyHeaderDynamic";
import TextInputField from "../../authentication/textInput";
import {
  activeFonts,
  colors,
  fontSizes,
  authenicationButton,
  buttonText,
  buttonTextAlt,
  screenSecondaryButton
} from "../../styles";
import { moderateScale } from "react-native-size-matters";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { DiveSpotContext } from "../../contexts/diveSpotContext";
import { MaterialIcons } from "@expo/vector-icons";
import { insertDiveSiteWaits } from "../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { ActiveConfirmationIDContext } from "../../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function DiveSiteUploader() {
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);


  const onSubmit = async () => {
    if (
      addSiteVals.Site.length > 0 &&
      addSiteVals.Latitude.length > 0 &&
      addSiteVals.Longitude.length > 0
    ) {
      insertDiveSiteWaits(addSiteVals);
      setAddSiteVals({
        ...addSiteVals,
        Site: "",
        Latitude: "",
        Longitude: "",
      });
      setConfirmationType("Dive Site");
      setActiveConfirmationID("ConfirmationSuccess");
      setConfirmationModal(true);
    } else {
      setActiveConfirmationID("ConfirmationCaution");
      setConfirmationModal(true);
    }
  };

  const getCurrentLocation = async () => {
    Keyboard.dismiss();
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setAddSiteVals({
          ...addSiteVals,
          Latitude: location.coords.latitude.toString(),
          Longitude: location.coords.longitude.toString(),
        });
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setChosenModal("DiveSite");
    setMapHelper(true);
    setMapConfig(1);
    setLevelTwoScreen(false);
  };

  const onClose = async () => {
    setLevelTwoScreen(false);
    setAddSiteVals({
      ...addSiteVals,
      Site: "",
      Latitude: "",
      Longitude: "",
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
      <View style={styles.contentContainer}>
        <Text style={styles.header}>{screenData.DiveSiteAdd.header}</Text>
        <View
          style={{
            marginBottom: windowHeight / 70,
            width: windowWidth * 0.75,
            alignItems: "center",
          }}
        >

          <View style={styles.textBuffer}>
            <TextInputField
              icon={"diving-scuba-flag"}
              inputValue={addSiteVals.Site}
              placeHolderText={screenData.DiveSiteAdd.siteNamePlaceholder}
              secure={false}
              vectorIcon={"MaterialCommunityIcons"}
              onChangeText={(text) =>
                setAddSiteVals({ ...addSiteVals, Site: text })
              }
            />
          </View>
          <View style={styles.textBuffer}>
            <TextInputField
              icon={"latitude"}
              inputValue={addSiteVals.Latitude}
              placeHolderText={screenData.DiveSiteAdd.latPlaceholder}
              vectorIcon={"MaterialCommunityIcons"}
              keyboardConfig="number-pad"
              secure={false}
              onChangeText={(text) =>
                setAddSiteVals({ ...addSiteVals, Latitude: text })
              }
            />
          </View>
          <View style={styles.textBuffer}>
            <TextInputField
              icon={"longitude"}
              inputValue={addSiteVals.Longitude}
              placeHolderText={screenData.DiveSiteAdd.lngPlaceholder}
              vectorIcon={"MaterialCommunityIcons"}
              keyboardConfig="number-pad"
              secure={false}
              onChangeText={(text) =>
                setAddSiteVals({ ...addSiteVals, Longitude: text })
              }
            />
          </View>
        </View>

        <View style={styles.buttonOptions}>
          <TouchableWithoutFeedback onPress={() => getCurrentLocation()}>
            <View style={styles.locationButton}>
              <Text style={styles.locationText}>
                {screenData.DiveSiteAdd.myLocationButton}
              </Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => onNavigate()}>
            <View style={styles.pinButton}>
              <Text style={styles.pinText}>
                {screenData.DiveSiteAdd.pinButton}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text style={styles.explainer}>{screenData.DiveSiteAdd.myLocationexplainer}</Text>

        <View style={styles.buttonBox}>
          <TouchableWithoutFeedback onPress={() => onSubmit()}>
            <View style={styles.submitButton}>
              <Text style={styles.submitText}>{screenData.DiveSiteAdd.submitButton}</Text>
              <MaterialIcons
                name="chevron-right"
                size={30}
                color={colors.themeWhite}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <WavyHeaderDynamic
        customStyles={styles.svgCurve}
        image={null}
        defaultImg={'diveSitePhoto'}
      ></WavyHeaderDynamic>
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
  textBuffer: {
    marginBottom: moderateScale(20),
  },
  buttonBox: {
    zIndex: -1,
    width: "100%",
    alignItems: "flex-end",
    marginTop: "-15%",
    marginRight: "15%",
  },
  buttonOptions: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    width: "84%",
  },
  locationButton: [
    screenSecondaryButton,
    { flexDirection: "row", marginTop: "0%" },
  ],
  locationText: [buttonTextAlt, { marginHorizontal: moderateScale(5), fontSize: fontSizes.StandardText }],
  explainer: {
    alignSelf: "flex-start",
    textAlign: "center",
    color: colors.themeBlack,
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.ThinItalic,
    marginTop: "2%",
    marginLeft: windowWidth > 600 ? "5%" : "9%",
    marginBottom: "0%",
    width: "30%",
  },
  pinButton: [
    screenSecondaryButton,
    { flexDirection: "row", marginTop: "0%" },
  ],
  pinText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
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
