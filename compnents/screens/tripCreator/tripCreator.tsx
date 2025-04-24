import React, { useState, useContext, useEffect } from "react";
import * as S from './styles';
import { Flex } from '../../ui/containes';
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import {
  activeFonts,
  colors,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
  authenicationButton,
  buttonText,
} from "../../styles";
import {
  getItinerariesByUserId,
  insertItineraryRequest,
  insertItinerary,
  getItineraryDiveSiteByIdArray,
} from "../../../supabaseCalls/itinerarySupabaseCalls";
import PlainTextInput from "../plaintextInput";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { moderateScale, s } from "react-native-size-matters";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { useTranslation } from "react-i18next";
import PriceTextInput from '../../reusables/priceTextInput';
import MobileTextInput from "../../reusables/textInput";
import ButtonIcon from "../../reusables/buttonIcon";
import Button from "../../reusables/button";

const windowHeight = Dimensions.get("window").height;

export default function TripCreatorPage(props) {
  const { } = props;
  const { profile } = useContext(UserProfileContext);
  const { editMode, setEditMode } = useContext(EditModeContext);

  const [dateType, setDateType] = useState("");
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);

  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { t } = useTranslation()
  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const [itineraryList, setItineraryList] = useState("");

  const drawerUpperBound = "80%";
  const drawerLowerBound = "17%";

  useEffect(() => {
    getItineraries(profile[0].UserID);
    getTripDiveSites(sitesArray);
    setTripDiveSites(getTripDiveSites(formValues.siteList));
    setSitesArray(formValues.siteList);
  }, []);

  useEffect(() => {
    setFormValues({ ...formValues, siteList: sitesArray });
    getTripDiveSites(sitesArray);
    setTripDiveSites(getTripDiveSites(sitesArray));
  }, [sitesArray]);

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

  const handleDatePickerConfirm = () => {
    let formattedDate = moment(date).format("YYYY-MM-DD");
    setFormValues({ ...formValues, [dateType]: formattedDate });
    hideDatePicker();
  };

  const getTripDiveSites = async (siteIds) => {
    try {
      const success = await getItineraryDiveSiteByIdArray(siteIds);
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

  const onClose = () => {
    setEditMode(false);
    setSitesArray([]);
    setTripDiveSites([]);
    // setValue("$0.00");
    setFormValues({
      ...formValues,
      BookingPage: "",
      tripName: "",
      startDate: "",
      endDate: "",
      price: 0,
      description: "",
      siteList: [],
    });
    setLevelTwoScreen(false);
  };

  const handleSubmit = () => {
    if (
      formValues.tripName === "" ||
      formValues.BookingPage === "" ||
      formValues.startDate === "" ||
      formValues.endDate === "" ||
      formValues.price === 0 ||
      formValues.description === "" ||
      formValues.siteList.length === 0
    ) {
      editMode
        ? setConfirmationType("Trip Edit")
        : setConfirmationType("Trip Submission");
      setActiveConfirmationID("ConfirmationCaution");
      setConfirmationModal(true);
      return;
    } else {
      editMode
        ? insertItineraryRequest(formValues, "Edit")
        : insertItinerary(formValues);
      setFormValues({
        ...formValues,
        BookingPage: "",
        tripName: "",
        startDate: "",
        endDate: "",
        price: 0,
        description: "",
        siteList: [],
      });
      setSitesArray([]);
      // setValue("$0.00");
      editMode
        ? setConfirmationType("Trip Edit")
        : setConfirmationType("Trip Submission");
      setActiveConfirmationID("ConfirmationSuccess");
      setConfirmationModal(true);
    }
  };

  const cloneButtonPress = () => {
    setEditMode(false);
  };

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Flex>
      <S.BackButtonWrapper>
        <ButtonIcon 
        icon="chevron-left"
        onPress={onClose}
        size='small'
        fillColor={colors.neutralGrey}
        />
      </S.BackButtonWrapper>
      
        {editMode && (
          <S.TopButtonBox>
            <Button 
              onPress={cloneButtonPress} 
              alt={true} 
              size='medium'
              title={t('TripCreator.cloneButton')} 
              />
          </S.TopButtonBox>
        )}

        <ScrollView contentContainerStyle={styles.content}>
          {editMode ? (
            <Text style={styles.header}>
              {t('TripCreator.headerEdit')}
            </Text>
          ) : (
            <Text style={styles.header}>{t('TripCreator.header')}</Text>
          )}

          <View style={styles.textBuffer}>
          <MobileTextInput 
              iconLeft="store"
              placeholder={t('TripCreator.tripNamePlaceholder')}
              value={formValues.tripName}
              onChangeText={(text: string) => setFormValues({ ...formValues, BotripNameokingPage: text })}
              />
          </View>

          <View style={styles.textBuffer}>
            <MobileTextInput 
              iconLeft="link"
              placeholder={t('TripCreator.bookingLinkPlaceholder')}
              value={formValues.BookingPage}
              onChangeText={(text: string) => setFormValues({ ...formValues, BookingPage: text })}
              />
          </View>

          <View style={styles.textBuffer}>
            <PriceTextInput
              iconLeft={"currency-usd"}
              placeholder={t('TripCreator.pricePlaceholder')}
              value={formValues && formValues.price}
              onChangeText={(text: string) => setFormValues({ ...formValues, price: text })}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.textBuffer}>
            <Toucher onPress={() => showDatePicker("startDate")}>
              <View pointerEvents="none">
              <MobileTextInput 
                iconLeft="calendar-start"
                placeholder={t('TripCreator.startDatePlaceholder')}
                value={formValues.startDate}
                onChangeText={(text: string) => setFormValues({ ...formValues, startDate: text })}
                />
              </View>
            </Toucher>
          </View>

          <View style={styles.textBuffer}>
            <Toucher onPress={() => showDatePicker("endDate")}>
              <View pointerEvents="none">
              <MobileTextInput 
                iconLeft="calendar-end"
                placeholder={t('TripCreator.endDatePlaceholder')}
                value={formValues.endDate}
                onChangeText={(text: string) => setFormValues({ ...formValues, endDate: text })}
                />
              </View>
            </Toucher>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={'position'}
            keyboardVerticalOffset={200}
          >
            <View style={styles.descriptionBox}>
              <PlainTextInput
                placeHolder={t('TripCreator.tripDescriptionPlaceholder')}
                content={formValues && formValues.description}
                fontSz={fontSizes.StandardText}
                isEditModeOn={true}
                onChangeText={(text) =>
                  setFormValues({ ...formValues, description: text })
                }
              />
            </View>
          </KeyboardAvoidingView>

          <S.BottomButtonBox>
            <Button 
              onPress={handleSubmit} 
              size='medium'
              title={t('TripCreator.submitButton')} 
              iconRight="chevron-right"
              />
          </S.BottomButtonBox>
        </ScrollView>

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleDatePickerConfirm}
          onCancel={hideDatePicker}
          maximumDate={dateType === "startDate" && formValues.endDate? new Date(formValues.endDate) : undefined}
          minimumDate={
            dateType === "endDate" && formValues.startDate
              ? new Date(new Date(formValues.startDate).setDate(new Date(formValues.startDate).getDate() + 1))
              : undefined
          }
        />
      </Flex>
    // </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginTop: '10%'
  },
  content: {
    height: "100%",
    width: "90%",
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
    justifyContent: "flex-start",
    borderWidth: moderateScale(1),
    borderColor: "darkgrey",
    borderRadius: moderateScale(10),
    paddingBottom: "2%",
    marginTop: "4%",
    height: "75%"
  },
  buttonBox: {
    zIndex: -1,
    width: "90%",
    alignItems: "flex-end",
    marginTop: "-15%",
    marginHorizontal: "10%",
  },
  submitButton: [
    authenicationButton,
    { flexDirection: "row", marginTop: windowHeight / 10 },
  ],
  submitText: [buttonText, { marginHorizontal: moderateScale(5) }],
  creatNewButton: [
    screenSecondaryButton,
    { zIndex: 10, position: "absolute", top: "7%", right: "6%" },
  ],
  createNewText: [
    buttonTextAlt,
    {
      fontSize: moderateScale(fontSizes.SmallText),
      marginHorizontal: moderateScale(5),
    },
  ],
});
