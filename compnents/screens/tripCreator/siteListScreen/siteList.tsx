import React, { useContext, useEffect, useState } from "react";
import { Keyboard, Platform, ScrollView, View } from "react-native";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import { Flex } from "../../../ui/containes"
import * as S from './styles';
import { colors } from "../../../styles";
import { moderateScale } from "react-native-size-matters";
import moment from "moment"
import { useTranslation } from "react-i18next";
import { getItineraryDiveSiteByIdArray, insertItinerary, insertItineraryRequest } from "../../../../supabaseCalls/itinerarySupabaseCalls";

import { TripSitesContext } from "../../../contexts/tripSitesContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { MapHelperContext } from "../../../contexts/mapHelperContext";
import { MapConfigContext } from "../../../contexts/mapConfigContext";
import { LevelTwoScreenContext } from "../../../contexts/levelTwoScreenContext";
import { ActiveConfirmationIDContext } from "../../../contexts/activeConfirmationIDContext";
import { ConfirmationModalContext } from "../../../contexts/confirmationModalContext";
import { ConfirmationTypeContext } from "../../../contexts/confirmationTypeContext";
import { EditModeContext } from "../../../contexts/editModeContext";
import { TripDetailContext } from "../../../contexts/tripDetailsContext";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import IconWithLabel from "../../../reusables/iconWithLabal";
import ButtonIcon from "../../../reusables/buttonIcon";
import Button from "../../../reusables/button";
import Label from "../../../reusables/label";
import PriceTextInput from "../../../reusables/priceTextInput";
import MobileTextInput from "../../../reusables/textInput";
import EmptyState from "../../../reusables/emptyState";
import ParallaxDrawer from "../../../reusables/parallaxDrawer";


export default function SiteList() {
  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { editMode, setEditMode } = useContext(EditModeContext);
  
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );

  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  
  const { formValues, setFormValues } = useContext(TripDetailContext);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateType, setDateType] = useState("");
  const [date, setDate] = useState(new Date());
  
  const { t } = useTranslation()
  
  useEffect(() => {
    getTripDiveSites(sitesArray);
  }, []);

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
    getTripDiveSites(setSitesArray);
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setMapHelper(true);
    setMapConfig(3);
    setLevelTwoScreen(false);
  };

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

  const cloneButtonPress = () => {
    setEditMode(false);
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

    return (
      <ParallaxDrawer/>
//       <Flex style={{width: "100%", alignItems: 'center', marginTop: Platform.OS === "ios" ? 0 : '17%'}}>

// <S.BackButtonWrapper>
//         <ButtonIcon 
//         icon="chevron-left"
//         onPress={onClose}
//         size='small'
//         fillColor={colors.neutralGrey}
//         />
//       </S.BackButtonWrapper>
      
//       {editMode ? (
//           <S.TopButtonBox>
//             <Button 
//               onPress={cloneButtonPress} 
//               alt={true} 
//               size='medium'
//               title={t('TripCreator.cloneButton')} 
//               />
//           </S.TopButtonBox>
//         ):   <S.TopButtonBox><View style={{height: moderateScale(50)}}/></S.TopButtonBox>}



// <ScrollView contentContainerStyle={{width: "100%"}}>
//           {editMode ? (
//             <S.Header>
//               {t('TripCreator.headerEdit')}
//             </S.Header>
//           ) : (
//             <S.Header>{t('TripCreator.header')}</S.Header>
//           )}


// <S.PageContentContainer>
// <S.TextBuffer>
//           <Label label="Price"/>
//             <PriceTextInput
//               iconLeft={"currency-usd"}
//               placeholder={t('TripCreator.pricePlaceholder')}
//               value={formValues && formValues.price}
//               onChangeText={(text: string) => setFormValues({ ...formValues, price: text })}
//               keyboardType="number-pad"
//             />
//           </S.TextBuffer>

//           <S.TextBufferDates>
//           <S.TextLabelDates>
//           <Label label="Start Date"/>
//             <Toucher onPress={() => showDatePicker("startDate")}>
//               <View pointerEvents="none">
//               <MobileTextInput 
//                 iconLeft="calendar-start"
//                 placeholder={t('TripCreator.startDatePlaceholder')}
//                 value={formValues.startDate}
//                 onChangeText={(text: string) => setFormValues({ ...formValues, startDate: text })}
//                 />
//               </View>
//             </Toucher>
//             </S.TextLabelDates>
//             <S.TextLabelDates>
//             <Label label="End Date"/>
//             <Toucher onPress={() => showDatePicker("endDate")}>
//               <View pointerEvents="none">
//               <MobileTextInput 
//                 iconLeft="calendar-end"
//                 placeholder={t('TripCreator.endDatePlaceholder')}
//                 value={formValues.endDate}
//                 onChangeText={(text: string) => setFormValues({ ...formValues, endDate: text })}
//                 />
//               </View>
//             </Toucher>
//             </S.TextLabelDates>
//           </S.TextBufferDates>

//       <Label label="Dive Sites"/>


//       <S.ScrollViewContainer>
//       <ScrollView>
//         {tripDiveSites.length === 0 && <EmptyState iconName="anchor" text='No Dive Sites Yet.'/>}
//       {Array.isArray(tripDiveSites) && tripDiveSites.map((tripDetails, index) => {
//         return (
//         <S.ListItemContainer key={tripDetails.id}>
//         <S.ItemHousing>
//         <IconWithLabel  label={tripDetails.name} iconName="anchor" fillColor="white" bgColor={colors.primaryBlue} buttonAction={() => removeFromSitesArray(tripDetails.id)}  />
//         </S.ItemHousing>
//             {index < tripDiveSites.length - 1 && <S.VerticalLine />}
//         </S.ListItemContainer>
//       )
//       })}
//       </ScrollView>

//         <S.ButtonHousing>
//             <Button 
//               onPress={onNavigate} 
//               size='medium'
//               alt={true}
//               title="Dive Sites"
//               iconLeft="plus"
//               />
//         </S.ButtonHousing>
//       </S.ScrollViewContainer>

//       <S.BottomButtonBox>
//             <Button 
//               onPress={handleSubmit} 
//               size='medium'
//               title={t('TripCreator.submitButton')} 
//               iconRight="chevron-right"
//               />
//           </S.BottomButtonBox>

//           </S.PageContentContainer>
//       </ScrollView>

//       <DateTimePickerModal
//       isVisible={datePickerVisible}
//           mode="date"
//           onConfirm={handleDatePickerConfirm}
//           onCancel={hideDatePicker}
//           maximumDate={dateType === "startDate" && formValues.endDate? new Date(formValues.endDate) : undefined}
//           minimumDate={
//             dateType === "endDate" && formValues.startDate
//               ? new Date(new Date(formValues.startDate).setDate(new Date(formValues.startDate).getDate() + 1))
//               : undefined
//           }
//         />
//       </Flex>
    )
  };