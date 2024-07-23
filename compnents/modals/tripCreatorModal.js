import {
  StyleSheet,
  View,
  Platform,
  TextInput,
  Keyboard,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Share from "react-native-share";
import UserNamer from "../tutorial/usernamer";
import React, { useState, useContext, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { getProfileWithStats } from "../../supabaseCalls/accountSupabaseCalls";
import { getItineraryDiveSiteByIdArray, insertItinerary } from "../../supabaseCalls/itinerarySupabaseCalls";
import { scale, moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { SelectedProfileContext } from "../contexts/selectedProfileModalContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { SitesArrayContext } from "../contexts/sitesArrayContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { MapConfigContext } from "../contexts/mapConfigContext";
import { ShopContext } from '../contexts/shopContext';
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputFieldLg from "../reusables/textInputLarge";
import InputFieldSm from "../reusables/textInputSmall";
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
  const { mapConfig, setMapConfig } = useContext(MapConfigContext);
  const { shop, setShop } = useContext(ShopContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { setMapHelper } = useContext(MapHelperContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(
    LargeModalSecondContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const [tripDiveSites, setTripDiveSites] = useState([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateType, setDateType] = useState("");

  useEffect(() => {
    getTripDiveSites();
    setSitesArray(formValues.DiveSites)
  }, []);

  useEffect(() => {
    setFormValues({ ...formValues, DiveSites: sitesArray})
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
    setSitesArray(sitesArray)

    const indexLocal = formValues.DiveSites.indexOf(siteIdNo);
    if (indexLocal > -1) {
      formValues.DiveSites.splice(index, 1);
    }
    getTripDiveSites();
  };

  const [formValues, setFormValues] = useState({
    BookingLink: "",
    TripName: "",
    StartDate: "",
    EndDate: "",
    Price: 0,
    TripDesc: "",
    DiveSites: [],
    ShopId: shop,
  });

  const [formValidation, SetFormValidation] = useState({
    BookingLinkVal: false,
    TripNameVal: false,
    StartDateVal: false,
    EndDateVal: false,
    PriceVal: false,
    TripDescVal: false,
    DiveSitesVal: false
  });

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
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("TripCreator");
    setLargeModalSecond(false);
  };

  const handleSubmit = () => {

    console.log("erhem", formValues)

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
      PriceVal: PriceVar
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
      // failBoxY.value = withTiming(scale(70));
      return;
    } else {
      insertItinerary(formValues);
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
        setValue("$0.00");
        // successBoxY.value = withTiming(scale(70));
      }
  };

  const { format: formatCurrency } = Intl.NumberFormat("en-Us", {
    currency: "USD",
    style: "currency",
  });

  function useATMInput() {
    const [value, setValue] = useState("$0.00");
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

  return (
    <View style={styles.container}>
      <ModalHeader
        titleText="Submit a new Trip"
        onClose={toggleTripCreatorModal}
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
                backgroundColor: formValidation.TripDescVal ? "pink" : "transparent"
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
        <SubmitButton buttonAction={handleSubmit} label={"Submit Trip"} />
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
  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(30),
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
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(10),
    width: "40%",
    // backgroundColor: "pink"
  },
  labelText: {
    marginTop: moderateScale(10),
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
    color: "white",
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: moderateScale(10),
    width: moderateScale(180),
    height: moderateScale(27),
    marginTop: scale(6),
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: moderateScale(10),
    width: moderateScale(180),
    height: moderateScale(27),
    marginTop: scale(6),
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  inputSmall: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(16),
    color: "white",
  },
  ShareButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  ShareButtonPressed: {
    backgroundColor: "#538dbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  FollowButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    height: moderateScale(40),
    marginTop: moderateScale(30),
    marginBottom: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  FollowButtonPressed: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    height: moderateScale(40),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  userContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? "18%" : "18%",
    left: "20%",
    backgroundColor: "transparent",
    alignItems: "center",
    height: "90%",
    width: "60%",
    borderRadius: 15,
    // backgroundColor: "green"
  },
  buttonContainer: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: moderateScale(110),
    marginTop: moderateScale(15),
  },
});
