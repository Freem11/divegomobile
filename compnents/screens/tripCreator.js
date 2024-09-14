import React, { useState, useContext, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import {
  activeFonts,
  colors,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
  authenicationButton,
  buttonText
} from "../styles";
import screenData from "./screenData.json";
import {
  getItinerariesByUserId,
  insertItineraryRequest,
  getItineraryDiveSiteByIdArray,
} from "../../supabaseCalls/itinerarySupabaseCalls";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import TextInputField from "../authentication/textInput";
import PlainTextInput from "./plaintextInput";
import BottomDrawer from "./animatedBottomDrawer";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { SessionContext } from "../contexts/sessionContext";
import { ShopModalContext } from "../contexts/shopModalContext";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import { EditModeContext } from "../../compnents/contexts/editModeContext";
import { ShopContext } from "../contexts/shopContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TripCreatorPage(props) {
  const {} = props;
  const tripsRef = useRef(null);
  const { profile } = useContext(UserProfileContext);
  const { setShopModal } = useContext(ShopModalContext);
  const { editMode, setEditMode } = useContext(EditModeContext);

  const [tripDiveSites, setTripDiveSites] = useState([]);
  const [dateType, setDateType] = useState("");
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { shop } = useContext(ShopContext);

  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);

  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const [itineraryList, setItineraryList] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  const drawerUpperBound = "80%";
  const drawerLowerBound = "15%";


  const [formValues, setFormValues] = useState({
    BookingLink: (editMode && editMode.itineraryInfo.BookingPage) || "",
    TripName: (editMode && editMode.itineraryInfo.tripName) || "",
    StartDate: (editMode && editMode.itineraryInfo.startDate) || "",
    EndDate: (editMode && editMode.itineraryInfo.endDate) || "",
    Price: (editMode && editMode.itineraryInfo.price) || 0,
    TripDesc: (editMode && editMode.itineraryInfo.description) || "",
    DiveSites:
      (editMode && editMode.itineraryInfo.siteList) || sitesArray || [],
    ShopId: (editMode && editMode.itineraryInfo.shopID) || shop,
  });

  useEffect(() => {
    getItineraries(profile[0].UserID);
  }, []);

  const getItineraries = async (IdNum) => {
    try {
      const itins = await getItinerariesByUserId(IdNum);
      if (itins.length > 0) {
        setItineraryList(itins[0].itineraries);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  //currency formatter stuff
  const { format: formatCurrency } = Intl.NumberFormat("en-Us", {
    currency: "USD",
    style: "currency",
  });

  function useATMInput() {
    const [value, setValue] = useState(
      editMode ? editMode.itineraryInfo.price : "$0.00"
    );
    function handleChange(value) {
      const decimal = Number(value.replace(/\D/g, "")) / 100;
      setValue(formatCurrency(decimal || 0).replace("R$\xa0", ""));
    }
    return [value, handleChange];
  }

  const [value, setValue] = useATMInput();

  useEffect(() => {
    setFormValues({ ...formValues, Price: value });
  }, [value]);

  //date picker stuff
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const showDatePicker = (value) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDatePickerConfirm = (date) => {
    let formattedDate = moment(date).format("YYYY-MM-DD");

    console.log(dateType, formattedDate, formValues.StartDate);
    if (dateType === "StartDate") {
      if (formValues.EndDate.length > 0 && formValues.EndDate < formattedDate) {
        return;
      }
    }

    if (dateType === "EndDate") {
      if (
        formValues.StartDate.length > 0 &&
        formValues.StartDate > formattedDate
      ) {
        return;
      }
    }

    setFormValues({ ...formValues, [dateType]: formattedDate });
    hideDatePicker();
  };


  //Handling the Dive site list 
  useEffect(() => {
    getTripDiveSites();
  }, []);


  // useEffect(() => {
  //   setFormValues({ ...formValues, DiveSites: sitesArray });
  //   setSitesArray(formValues.DiveSites)
  //   getTripDiveSites();
  // }, [sitesArray.length]);

  const getTripDiveSites = async () => {
    try {
      const success = await getItineraryDiveSiteByIdArray(formValues.DiveSites);
      if (success) {
        setTripDiveSites(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const removeFromSitesArray = async (siteIdNo) => {
    const index = sitesArray.indexOf(siteIdNo);
    if (index > -1) {
      sitesArray.splice(index, 1);
    }
    setSitesArray(sitesArray);

    const indexLocal = formValues.DiveSites.indexOf(siteIdNo);
    if (indexLocal > -1) {
      formValues.DiveSites.splice(index, 1);
    }
    getTripDiveSites();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={"darkgrey"}
        onPress={() => setLevelTwoScreen(false)}
        style={{ marginTop: "15%", alignSelf: "flex-start", marginLeft: "2%" }}
      />

      {editMode && (
        <TouchableWithoutFeedback onPress={null}>
          <View style={styles.creatNewButton}>
            <Text style={styles.createNewText}>
              {screenData.TripCreator.cloneButton}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.content}>
        {editMode ? (
          <Text style={styles.header}>{screenData.TripCreator.headerEdit}</Text>
        ) : (
          <Text style={styles.header}>{screenData.TripCreator.header}</Text>
        )}

        <View style={styles.textBuffer}>
          <TextInputField
            icon={"store"}
            inputValue={formValues.TripName}
            placeHolderText={screenData.TripCreator.tripNamePlaceholder}
            secure={false}
            onChangeText={(text) =>
              setFormValues({ ...formValues, TripName: text })
            }
          />
        </View>

        <View style={styles.textBuffer}>
          <TextInputField
            icon={"alternate-email"}
            inputValue={formValues.BookingLink}
            placeHolderText={screenData.TripCreator.bookingLinkPlaceholder}
            secure={false}
            onChangeText={(text) =>
              setFormValues({ ...formValues, BookingLink: text })
            }
          />
        </View>

        <View style={styles.textBuffer}>
          <TextInputField
            icon={"attach-money"}
            inputValue={formValues.Price}
            placeHolderText={screenData.TripCreator.pricePlaceholder}
            secure={false}
            inputValue={value}
            keyboardType={"numbers-and-punctuation"}
            onChangeText={setValue}
          />
        </View>

        <View style={styles.textBuffer}>
          <Toucher onPress={() => showDatePicker("StartDate")}>
            <View pointerEvents="none">
              <TextInputField
                icon={"calendar-month-outline"}
                inputValue={formValues.StartDate}
                placeHolderText={screenData.TripCreator.startDatePlaceholder}
                secure={false}
                vectorIcon={"MaterialCommunityIcons"}
              />
            </View>
          </Toucher>
        </View>

        <View style={styles.textBuffer}>
          <Toucher onPress={() => showDatePicker("EndDate")}>
            <View pointerEvents="none">
              <TextInputField
                icon={"calendar-month-outline"}
                inputValue={formValues.EndDate}
                placeHolderText={screenData.TripCreator.endDatePlaceholder}
                secure={false}
                vectorIcon={"MaterialCommunityIcons"}
              />
            </View>
          </Toucher>
        </View>

        <View style={styles.descriptionBox}>
          <PlainTextInput
            placeHolder={screenData.TripCreator.tripDescriptionPlaceholder}
            content={formValues.TripDesc}
            fontSz={fontSizes.StandardText}
            isEditModeOn={true}
            onChangeText={(text) =>
              setFormValues({ ...formValues, TripDesc: text })
            }
          />
        </View>
      </View>

      <View style={styles.buttonBox}>
          <TouchableWithoutFeedback onPress={() => onSubmit()}>
            <View style={styles.submitButton}>
        <Text style={styles.submitText}>{screenData.TripCreator.submitButton}</Text>
              <MaterialIcons
                name="chevron-right"
                size={30}
                color={colors.themeWhite}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <BottomDrawer
        dataSet={formValues.DiveSites}
        dataSetType={"Trips"}
        lowerBound={drawerLowerBound}
        upperBound={drawerUpperBound}
        drawerHeader={screenData.TripCreator.drawerHeader}
        emptyDrawer={screenData.TripCreator.emptyDrawer}
        headerButton={screenData.TripCreator.selectSitesButton}
      />

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
      />
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    // justifyContent: "center",
    height: windowHeight,
  },
  content: {
    width: "90%",
    marginBottom: "5%",
  },
  header: {
    zIndex: 10,
    marginTop: "5%",
    marginBottom: "8%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Bold,
    color: "darkgrey",
  },
  textBuffer: {
    marginBottom: moderateScale(20),
  },
  descriptionBox: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: "darkgrey",
    borderRadius: moderateScale(10),
    paddingBottom: "2%",
    marginTop: "5%"
  },
  buttonBox: {
    zIndex: -1,
    width: "90%",
    alignItems: "flex-end",
    marginTop: "-15%",
    marginHorizontal: "15%",
  },
  submitButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 10 },
  ],
  submitText: [buttonText, { marginHorizontal: moderateScale(5) }],
  subHeaders: {
    zIndex: 10,
    marginTop: "10%",
    fontSize: moderateScale(fontSizes.SubHeading),
    fontFamily: activeFonts.Medium,
    color: "darkgrey",
    marginLeft: "5%",
  },
  subHeadersDanger: {
    zIndex: 10,
    position: "absolute",
    bottom: moderateScale(120),
    marginTop: windowHeight / 6,
    fontSize: moderateScale(fontSizes.SubHeading),
    fontFamily: activeFonts.Medium,
    color: "maroon",
    marginLeft: "5%",
  },
  dataHousing: {
    marginTop: "2%",
    borderTopWidth: moderateScale(1),
    borderTopColor: "darkgrey",
    paddingBottom: "2%",
    borderBottomWidth: moderateScale(1),
    borderBottomColor: "darkgrey",
  },
  dataHousingDanger: {
    position: "absolute",
    bottom: moderateScale(40),
    backgroundColor: "#FCE4EC",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    borderTopWidth: moderateScale(1),
    borderTopColor: "maroon",
    paddingBottom: "4%",
    borderBottomWidth: moderateScale(1),
    borderBottomColor: "maroon",
    width: "90%",
  },
  dataLabels: {
    zIndex: 10,
    marginTop: "2%",
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Bold,
    color: colors.themeBlack,
    marginLeft: "10%",
  },
  dataLabelsDanger: {
    zIndex: 10,
    marginTop: "4%",
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Bold,
    color: "maroon",
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
    marginLeft: "15%",
    marginTop: moderateScale(2),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.thin,
    color: colors.primaryBlue,
  },
  creatNewButton: [
    screenSecondaryButton,
    { zIndex: 10, position: "absolute", top: "7%", right: "6%" },
  ],
  createNewText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
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
