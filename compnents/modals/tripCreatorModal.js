import {
  StyleSheet,
  View,
  Platform,
  TextInput,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import {
  getItineraryDiveSiteByIdArray,
  insertItinerary,
  insertItineraryRequest,
} from "../../supabaseCalls/itinerarySupabaseCalls";
import { moderateScale } from "react-native-size-matters";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { MapConfigContext } from "../contexts/mapConfigContext";
import { ShopContext } from "../contexts/shopContext";
import { EditModeContext } from "../contexts/editModeContext";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputFieldLg from "../reusables/textInputLarge";
import InputField from "../reusables/textInputs";
import ModalHeader from "../reusables/modalHeader";
import ListHeader from "../reusables/listHeader";
import ListItem from "../reusables/listItem";
import SubmitButton from "../reusables/submitButton";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import InsetShadow from "react-native-inset-shadow";

let TripNameVar = false;
let BookingLinkVar = false;
let StartDateVar = false;
let EndDateVar = false;
let TripDescVar = false;
let PriceVar = false;

const windowWidth = Dimensions.get("window").width;

export default function TripCreatorModal() {
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { shop } = useContext(ShopContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(
    LargeModalSecondContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const [tripDiveSites, setTripDiveSites] = useState([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateType, setDateType] = useState("");

  const [formValues, setFormValues] = useState({
    BookingLink: (editMode && editMode.itineraryInfo.BookingPage) || "",
    TripName: (editMode && editMode.itineraryInfo.tripName) || "",
    StartDate: (editMode && editMode.itineraryInfo.startDate) || "",
    EndDate: (editMode && editMode.itineraryInfo.endDate) || "",
    Price: (editMode && editMode.itineraryInfo.price) || 0,
    TripDesc: (editMode && editMode.itineraryInfo.description) || "",
    DiveSites: (editMode && editMode.itineraryInfo.siteList) || [],
    ShopId: (editMode && editMode.itineraryInfo.shopID) || shop,
  });

  const [formValidation, SetFormValidation] = useState({
    BookingLinkVal: false,
    TripNameVal: false,
    StartDateVal: false,
    EndDateVal: false,
    PriceVal: false,
    TripDescVal: false,
    DiveSitesVal: false,
  });

  useEffect(() => {
    getTripDiveSites();
    setSitesArray(formValues.DiveSites);
  }, []);

  useEffect(() => {
    setFormValues({ ...formValues, DiveSites: sitesArray });
    getTripDiveSites();
  }, [sitesArray.length]);

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

  const showDatePicker = (value) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    let formattedDate = moment(date).format("YYYY-MM-DD");

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

  const toggleTripCreatorModal = () => {
    setFormValues({
      ...formValues,
      BookingLink: "",
      TripName: "",
      StartDate: "",
      EndDate: "",
      Price: 0,
      TripDesc: "",
      DiveSites: [],
    });
    setSitesArray([]);
    setValue("$0.00");
    setEditMode(false);
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("TripCreator");
    setLargeModalSecond(false);
  };

  const handleSubmit = () => {
    if (formValues.TripName === "" || formValues.TripName === null) {
      TripNameVar = true;
    } else {
      TripNameVar = false;
    }

    if (formValues.BookingLink === "" || formValues.BookingLink === null) {
      BookingLinkVar = true;
    } else {
      BookingLinkVar = false;
    }

    if (formValues.StartDate === "" || formValues.StartDate === null) {
      StartDateVar = true;
    } else {
      StartDateVar = false;
    }

    if (formValues.EndDate === "" || formValues.EndDate === null) {
      EndDateVar = true;
    } else {
      EndDateVar = false;
    }

    if (formValues.TripDesc === "" || formValues.TripDesc === null) {
      TripDescVar = true;
    } else {
      TripDescVar = false;
    }

    if (formValues.Price === 0 || formValues.Price === "$0.00") {
      PriceVar = true;
    } else {
      PriceVar = false;
    }

    SetFormValidation({
      ...formValidation,
      TripNameVal: TripNameVar,
      BookingLinkVal: BookingLinkVar,
      StartDateVal: StartDateVar,
      EndDateVal: EndDateVar,
      TripDescVal: TripDescVar,
      PriceVal: PriceVar,
    });

    if (
      formValues.TripName === "" ||
      formValues.BookingLink === "" ||
      formValues.StartDate === "" ||
      formValues.EndDate === "" ||
      formValues.Price === 0 ||
      formValues.TripDesc === "" ||
      formValues.DiveSites.length === 0
    ) {
      editMode
        ? setConfirmationType("Trip Edit")
        : setConfirmationType("Trip Submission");
      setActiveConfirmationID("ConfirmationCaution");
      setConfirmationModal(true);
      return;
    } else {
      editMode ? insertItineraryRequest(formValues, "Edit") : insertItinerary(formValues);
      setFormValues({
        ...formValues,
        BookingLink: "",
        TripName: "",
        StartDate: "",
        EndDate: "",
        Price: 0,
        TripDesc: "",
        DiveSites: [],
      });
      setSitesArray([]);
      setValue("$0.00");
      editMode
        ? setConfirmationType("Trip Edit")
        : setConfirmationType("Trip Submission");
      setActiveConfirmationID("ConfirmationSuccess");
      setConfirmationModal(true);
    }
  };

  const { format: formatCurrency } = Intl.NumberFormat("en-Us", {
    currency: "USD",
    style: "currency",
  });

  function useATMInput() {
    const [value, setValue] = useState(editMode? editMode.itineraryInfo.price : "$0.00");
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

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapHelper(true);
    setMapConfig(3);
    setLargeModalSecond(false);
  };

  const [modalHeader, setModalHeader] = useState(
    editMode ? "Request Trip Edits"  : "Submit a New Trip"
  );

  const [submitText, setSubmitText] = useState(
    editMode ? "Submit Edit Request" : "Submit Trip"
  );

const editButtonPress = () => {
  setEditMode(false) 
  setModalHeader("Submit a New Trip")
  setSubmitText("Submit Trip")
}

  return (
    <View style={styles.container}>
      <ModalHeader
        titleText={modalHeader}
        onClose={toggleTripCreatorModal}
        icon={'folder-copy'}
        altButton={editMode.IsEditModeOn ? editButtonPress : null}
      />

      <ScrollView
        contentContainerStyle={{
          height: "auto",
          alignItems: "center",
          // backgroundColor: "pink"
        }}
        style={styles.bodyContent}
      >
        <InputFieldLg
          validationItem={formValidation.TripNameVal}
          placeHolderText={"Trip Name"}
          inputValue={formValues.TripName}
          keyboardType={"default"}
          onChangeText={(text) =>
            setFormValues({ ...formValues, TripName: text })
          }
        />
        <InputFieldLg
          validationItem={formValidation.BookingLinkVal}
          placeHolderText={"Booking Link"}
          inputValue={formValues.BookingLink}
          keyboardType={"default"}
          onChangeText={(text) =>
            setFormValues({ ...formValues, BookingLink: text })
          }
        />

        <View style={styles.statsContainer}>
          <View style={styles.leftSide}>
            <InputField
              validationItem={formValidation.PriceVal}
              placeHolderText={"Price"}
              inputValue={value}
              keyboardType={"numbers-and-punctuation"}
              onChangeText={setValue}
            />
            <View style={styles.spacer}>
            <TouchableWithoutFeedback
              onPress={() => showDatePicker("StartDate")}
              style={{
                marginTop: moderateScale(10),
                marginBottom: moderateScale(10),
              }}
            >
              <View pointerEvents="none">
                <InputField
                  validationItem={formValidation.StartDateVal}
                  placeHolderText={"Start Date"}
                  inputValue={formValues.StartDate}
                  keyboardType={"default"}
                  noPtEvents={true}
                />
              </View>
            </TouchableWithoutFeedback>
            </View>
            <View style={styles.spacer}>
            <TouchableWithoutFeedback
              onPress={() => showDatePicker("EndDate")}
              style={{
                marginTop: moderateScale(5),
                marginBottom: moderateScale(10),
              }}
            >
              <View pointerEvents="none">
                <InputField
                  validationItem={formValidation.EndDateVal}
                  placeHolderText={"End Date"}
                  inputValue={formValues.EndDate}
                  keyboardType={"default"}
                  noPtEvents={true}
                />
              </View>
            </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={styles.rightSide}>
            <ListHeader
              titleText="Possible Sites in this Trip"
              buttonAction={onNavigate}
              buttonText={"Select Sites"}
            />
            <ScrollView
              style={{
                width: "102%",
                height: moderateScale(200),
                paddingLeft: moderateScale(5),
                borderRadius: moderateScale(15),
                backgroundColor: formValidation.EndDateVal
                  ? "pink"
                  : "transparent",
              }}
            >
              {tripDiveSites.map((site) => {
                if (site.region) {
                  return (
                    <ListItem
                      key={site.id}
                      titleText={`${site.name} ~ ${site.region}`}
                      buttonAction={() => removeFromSitesArray(site.id)}
                    />
                  );
                } else {
                  return (
                    <ListItem
                      key={site.id}
                      titleText={`${site.name}`}
                      buttonAction={() => removeFromSitesArray(site.id)}
                    />
                  );
                }
              })}
            </ScrollView>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginTop: moderateScale(20),
            marginBottom: moderateScale(20),
          }}
        >
          <InsetShadow
            containerStyle={{
              backgroundColor: "transparent",
              borderRadius: moderateScale(15),
              height: moderateScale(200),
              width: "90%",
              marginLeft: "5%",
              alignItems: "center",
              justifyContent: "center",
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.3}
          >
            <TextInput
              style={{
                width: "90%",
                height: moderateScale(180),
                borderRadius: moderateScale(15),
                margin: moderateScale(5),
                textAlign: "center",
                fontFamily: "Itim_400Regular",
                backgroundColor: formValidation.TripDescVal
                  ? "pink"
                  : "transparent",
              }}
              value={formValues.TripDesc}
              placeholder={"Trip Details"}
              placeholderTextColor="darkgrey"
              keyboardType={"default"}
              color={"#F0EEEB"}
              fontSize={moderateScale(18)}
              multiline={true}
              onChangeText={(text) =>
                setFormValues({ ...formValues, TripDesc: text })
              }
            ></TextInput>
          </InsetShadow>
        </View>
      </ScrollView>

      <View
        style={{
          zIndex: 2,
          alignItems: "center",
          backgroundColor: "#538bdb",
          width: "100%",
          height: "6%",
        }}
      >
        <SubmitButton buttonAction={handleSubmit} label={submitText} />
      </View>
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#538bdb",
    // backgroundColor: 'green',
    marginBottom: "2%",
    width: "98%",
    height: "30%",
    marginLeft: 2,
    marginTop: "2%",
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  statsContainer: {
    // backgroundColor: 'orange',
    marginTop: moderateScale(20),
    flexDirection: windowWidth > 500 ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
  },
  leftSide: {
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: moderateScale(250),
    // backgroundColor: "blue",
    margin: moderateScale(2),
    marginBottom: moderateScale(20),
  },
  rightSide: {
    width: "50%",
    alignItems: "center",
    borderRadius: moderateScale(10),
    minWidth: moderateScale(200),
    // backgroundColor: "green",
    margin: moderateScale(2),
  },
  spacer: {
    marginTop: moderateScale(20)
  }
});
