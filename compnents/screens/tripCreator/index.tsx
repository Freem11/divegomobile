import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import moment from "moment";

import { getItineraryDiveSiteByIdArray, insertItinerary, insertItineraryRequest, itineraries } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ItineraryItem } from "../../../entities/itineraryItem";

import TripCreatorPageView from "./tripCreator";
import { Form } from "./form";


type TripCreatorModalProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
  itineraryInfo?: ItineraryItem
};

export default function TripCreatorPage({
  closeParallax,
  restoreParallax,
  itineraryInfo,
}: TripCreatorModalProps) {

  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);
  const { editMode } = useContext(EditModeContext);
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);

  const getTripDiveSites = async(siteIds: number[]) => {
    try {
      const success = await getItineraryDiveSiteByIdArray(siteIds);
      if (success) {
        setTripDiveSites(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    getTripDiveSites(sitesArray);
    setTripDiveSites(getTripDiveSites(formValues.siteList));
  }, []);

  useEffect(() => {
    setFormValues({ ...formValues, siteList: sitesArray });
    getTripDiveSites(sitesArray);
  }, [sitesArray]);

  const onSubmit = async(formData: Required<Form>) => {
    editMode
      ? await insertItineraryRequest(formData, "Edit")
      : await insertItinerary(formData);
    setSitesArray([]);
  };
  
  const removeFromSitesArray = async(siteIdNo: number, siteList: number[]) => {

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

  useEffect(() => {
    if(levelTwoScreen){
      restoreParallax();
    }
  }, [levelTwoScreen]);
 

  //date picker stuff
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateType, setDateType] = useState("");
    
  const showDatePicker = (value: string) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  
  const handleDatePickerConfirm = () => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setFormValues({ ...formValues, [dateType]: formattedDate });
    hideDatePicker();
  };

  return (
    <TripCreatorPageView
      editMode={editMode}
      onSubmit={onSubmit}
      closeParallax={closeParallax}
      restoreParallax={restoreParallax}
      tripDiveSites={tripDiveSites}
      sitesArray={sitesArray}
      removeFromSitesArray={removeFromSitesArray}
      showDatePicker={showDatePicker}
      handleDatePickerConfirm={handleDatePickerConfirm}
      hideDatePicker={hideDatePicker}
      datePickerVisible={datePickerVisible}
      dateType={dateType}
      values={{
        Name:    itineraryInfo?.tripName,
        Link:    itineraryInfo?.BookingPage,
        Price:   itineraryInfo?.price,
        Start:   itineraryInfo?.startDate,
        End:     itineraryInfo?.endDate,
        Details: itineraryInfo?.description,
      }}
    />
  )
}