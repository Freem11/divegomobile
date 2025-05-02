import React, { useState, useContext, useEffect } from "react";
import * as S from './styles';
import { Flex } from '../../../ui/containes';
import {
  View,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { colors } from "../../../styles";
import {
  getItinerariesByUserId,
  insertItineraryRequest,
  insertItinerary,
  getItineraryDiveSiteByIdArray,
} from "../../../../supabaseCalls/itinerarySupabaseCalls";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { moderateScale, s } from "react-native-size-matters";
import { TripDetailContext } from "../../../contexts/tripDetailsContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { UserProfileContext } from "../../../contexts/userProfileContext";
import { LevelTwoScreenContext } from "../../../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../../../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../../contexts/confirmationModalContext";
import { EditModeContext } from "../../../contexts/editModeContext";
import { TripSitesContext } from "../../../contexts/tripSitesContext";
import { useTranslation } from "react-i18next";
import PriceTextInput from '../../../reusables/priceTextInput';
import MobileTextInput from "../../../reusables/textInput";
import ButtonIcon from "../../../reusables/buttonIcon";
import Button from "../../../reusables/button";
import Label from "../../../reusables/label";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import ParallaxDrawer from "../../../reusables/parallaxDrawer";

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
    getTripDiveSites(sitesArray);
  };

  const onClose = () => {
    setEditMode(false);
    setSitesArray([]);
    setTripDiveSites([]);
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

      <S.ContentContainer>      
        {editMode ? (
          <S.TopButtonBox>
            <Button 
              onPress={cloneButtonPress} 
              alt={true} 
              size='medium'
              title={t('TripCreator.cloneButton')} 
              />
          </S.TopButtonBox>
        ):   <S.TopButtonBox><View style={{height: moderateScale(0)}}/></S.TopButtonBox>}

          {editMode ? (
            <S.Header>
              {t('TripCreator.headerEdit')}
            </S.Header>
          ) : (
            <S.Header>{t('TripCreator.header')}</S.Header>
          )}

<S.InputGroupContainer>
          <S.TextBuffer>
          <Label label="Trip Name"/>
          <MobileTextInput 
              iconLeft="store"
              placeholder={t('TripCreator.tripNamePlaceholder')}
              value={formValues.tripName}
              onChangeText={(text: string) => setFormValues({ ...formValues, BotripNameokingPage: text })}
              />
          </S.TextBuffer>

          <S.TextBuffer>
          <Label label="Booking Page URL"/>
            <MobileTextInput 
              iconLeft="link"
              placeholder={t('TripCreator.bookingLinkPlaceholder')}
              value={formValues.BookingPage}
              onChangeText={(text: string) => setFormValues({ ...formValues, BookingPage: text })}
              />
          </S.TextBuffer>

          <S.TextBuffer>
          <Label label="Price"/>
            <PriceTextInput
              iconLeft={"currency-usd"}
              placeholder={t('TripCreator.pricePlaceholder')}
              value={formValues && formValues.price}
              onChangeText={(text: string) => setFormValues({ ...formValues, price: text })}
              keyboardType="number-pad"
            />
          </S.TextBuffer>

          <S.TextBufferDates>
          <S.TextLabelDates>
          <Label label="Start Date"/>
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
            </S.TextLabelDates>
            <S.TextLabelDates>
            <Label label="End Date"/>
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
            </S.TextLabelDates>
          </S.TextBufferDates>

          <Label label="Details"/>


      
            
            <S.DescriptionBox>
            {/* <KeyboardAvoidingView
            behavior={'position'}
            keyboardVerticalOffset={moderateScale(100)}
          > */}
              <S.MultilineTextInput
                multiline
                placeholder={t('TripCreator.tripDescriptionPlaceholder')}
                value={formValues && formValues.description}
                onChangeText={(text) =>
                  setFormValues({ ...formValues, description: text })
                }
              />
              {/* </KeyboardAvoidingView> */}
            </S.DescriptionBox>
            </S.InputGroupContainer>       

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
      </S.ContentContainer>
  );
}
