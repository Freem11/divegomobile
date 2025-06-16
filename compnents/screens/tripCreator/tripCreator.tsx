import React, { useState, useContext, useEffect } from "react";
import * as S from "./styles";
import { View, Keyboard, ScrollView } from "react-native";
import { colors } from "../../styles";
import {
  insertItineraryRequest,
  insertItinerary,
  getItineraryDiveSiteByIdArray,
  itineraries
} from "../../../supabaseCalls/itinerarySupabaseCalls";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { ActiveConfirmationIDContext } from "../../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { useTranslation } from "react-i18next";
import PriceTextInput from "../../reusables/priceTextInput";
import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import Label from "../../reusables/label";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import EmptyState from "../../reusables/emptyState";
import IconWithLabel from "../../reusables/iconWithLabal";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";

type TripCreatorProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
  onDrawerHitBottom?: () => void;
  selectedShop: number
};

export default function TripCreatorPage({
  closeParallax,
  restoreParallax,
  selectedShop
}: TripCreatorProps) {

  const { profile } = useContext(UserProfileContext);
  const { editMode, setEditMode } = useContext(EditModeContext);

  const [dateType, setDateType] = useState("");
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);

  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { t } = useTranslation();
  const [itineraryList, setItineraryList] = useState("");
  
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);

  useEffect(() => {
    getItineraries(selectedShop);
    getTripDiveSites(sitesArray);
    setTripDiveSites(getTripDiveSites(formValues.siteList));
    // setSitesArray(formValues.siteList);
  }, []);


  useEffect(() => {
    if(levelTwoScreen){
      restoreParallax();
    }
  }, [levelTwoScreen]);
 
  
  useEffect(() => {
    setFormValues({ ...formValues, siteList: sitesArray });
    getTripDiveSites(sitesArray);
    // setTripDiveSites(getTripDiveSites(sitesArray));
  }, [sitesArray]);

  const getItineraries = async (IdNum) => {
    try {
      const itins = await itineraries(IdNum);
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

  const getTripDiveSites = async (siteIds: number[]) => {
    try {
      const success = await getItineraryDiveSiteByIdArray(siteIds);
      if (success) {
        setTripDiveSites(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const removeFromSitesArray = async (siteIdNo: number, siteList: number[]) => {

    const index = siteList.indexOf(siteIdNo);
    if (index > -1) {
      siteList.splice(index, 1);
    }
    setSitesArray(siteList);
    const indexLocal = formValues.siteList.indexOf(siteIdNo);
    if (indexLocal > -1) {
      formValues.siteList.splice(index, 1);
    }
    getTripDiveSites(siteList);
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
      console.log("TC submit?")
      setSitesArray([]);

      editMode
        ? setConfirmationType("Trip Edit")
        : setConfirmationType("Trip Submission");
      setActiveConfirmationID("ConfirmationSuccess");
      setConfirmationModal(true);
    }
  };

  return (
    <S.ContentContainer>
      {editMode ? (
        <S.Header>{t("TripCreator.headerEdit")}</S.Header>
      ) : (
        <S.Header>{t("TripCreator.header")}</S.Header>
      )}

      <S.InputGroupContainer>
        <Label label="Details" />
        <S.TextBuffer>
          <MobileTextInput
            iconLeft="store"
            placeholder={t("TripCreator.tripNamePlaceholder")}
            value={formValues.tripName}
            onChangeText={(text: string) =>
              setFormValues({ ...formValues, tripName: text })
            }
          />
        </S.TextBuffer>

        <S.TextBuffer>
          <MobileTextInput
            iconLeft="link"
            placeholder={t("TripCreator.bookingLinkPlaceholder")}
            value={formValues.BookingPage}
            onChangeText={(text: string) =>
              setFormValues({ ...formValues, BookingPage: text })
            }
          />
        </S.TextBuffer>

        <S.TextBuffer>
          <PriceTextInput
            iconLeft={"currency-usd"}
            placeholder={t("TripCreator.pricePlaceholder")}
            value={formValues && formValues.price}
            onChangeText={(text: string) =>
              setFormValues({ ...formValues, price: text })
            }
            keyboardType="number-pad"
          />
        </S.TextBuffer>

        <S.TextBufferDates>
          <S.TextLabelDates>
            <Toucher onPress={() => showDatePicker("startDate")}>
              <View pointerEvents="none">
                <MobileTextInput
                  iconLeft="calendar-start"
                  placeholder={t("TripCreator.startDatePlaceholder")}
                  value={formValues.startDate}
                  onChangeText={(text: string) =>
                    setFormValues({ ...formValues, startDate: text })
                  }
                />
              </View>
            </Toucher>
          </S.TextLabelDates>
          <S.TextLabelDates>
            <Toucher onPress={() => showDatePicker("endDate")}>
              <View pointerEvents="none">
                <MobileTextInput
                  iconLeft="calendar-end"
                  placeholder={t("TripCreator.endDatePlaceholder")}
                  value={formValues.endDate}
                  onChangeText={(text: string) =>
                    setFormValues({ ...formValues, endDate: text })
                  }
                />
              </View>
            </Toucher>
          </S.TextLabelDates>
        </S.TextBufferDates>

        <Label label="Itinerary" />

        <S.DescriptionBox>
          <S.MultilineTextInput
            multiline
            placeholder={t("TripCreator.tripDescriptionPlaceholder").replace(/\\n/g, '\n')}
            value={formValues && formValues.description}
            onChangeText={(text) =>
              setFormValues({ ...formValues, description: text })
            }
          />
        </S.DescriptionBox>

        <Label label="Dive Sites" />

        <S.ScrollViewContainer>
          <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
            {tripDiveSites && tripDiveSites.length === 0 && (
              <EmptyState iconName="anchor" text="No Dive Sites Yet." />
            )}
            {Array.isArray(tripDiveSites) &&
              tripDiveSites.map((tripDetails, index) => {
                return (
                  <S.ListItemContainer key={tripDetails.id}>
                    <S.ItemHousing>
                      <IconWithLabel
                        label={tripDetails.name}
                        iconName="anchor"
                        fillColor="white"
                        bgColor={colors.primaryBlue}
                        buttonAction={() =>
                          removeFromSitesArray(tripDetails.id, sitesArray)
                        }
                      />
                    </S.ItemHousing>
                    {index < tripDiveSites.length - 1 && <S.VerticalLine />}
                  </S.ListItemContainer>
                );
              })}
          </ScrollView>

          <S.ButtonHousing>
            <Button
              onPress={() => closeParallax(1)}
              size="medium"
              alt={true}
              title="Dive Sites"
              iconLeft="plus"
            />
          </S.ButtonHousing>
        </S.ScrollViewContainer>
       

        <S.BottomButtonBox>
          <Button
            onPress={handleSubmit}
            size="medium"
            title={t("TripCreator.submitButton")}
            iconRight="chevron-right"
          />
        </S.BottomButtonBox>
      </S.InputGroupContainer>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDatePickerConfirm}
        onCancel={hideDatePicker}
        maximumDate={
          dateType === "startDate" && formValues.endDate
            ? new Date(formValues.endDate)
            : undefined
        }
        minimumDate={
          dateType === "endDate" && formValues.startDate
            ? new Date(
                new Date(formValues.startDate).setDate(
                  new Date(formValues.startDate).getDate() + 1
                )
              )
            : undefined
        }
      />
    </S.ContentContainer>
  );
}
