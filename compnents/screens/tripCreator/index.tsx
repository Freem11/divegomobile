import React, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import moment from "moment";

import { showError, showSuccess } from "../../toast";
import { getItineraryDiveSiteByIdArray, insertItinerary, insertItineraryRequest } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { TripSitesContext } from "../../contexts/tripSitesContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { ItineraryItem } from "../../../entities/itineraryItem";
import { useMapStore } from "../../googleMap/useMapStore";
import { SelectedShopContext } from "../../contexts/selectedShopContext";

import TripCreatorPageView from "./tripCreator";
import { Form } from "./form";

type TripCreatorModalProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
  itineraryInfo?: ItineraryItem
  getTripDiveSites: (siteIds: number[]) => void
};

export default function TripCreatorPage({
  closeParallax,
  restoreParallax,
  itineraryInfo,
  getTripDiveSites,
}: TripCreatorModalProps) {

  const storeFormValues = useMapStore((state) => state.formValues);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { editMode } = useContext(EditModeContext);
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);
  const { selectedShop } = useContext(SelectedShopContext);

  useEffect(() => {

    setSitesArray(itineraryInfo?.siteList || []);
  }, []);

  useEffect(() => {
    setFormValues({ ...storeFormValues, siteList: sitesArray });
    const diveSites = getTripDiveSites(sitesArray);

    setTripDiveSites(diveSites);
  }, [sitesArray]);

  const onSubmit = async (formData: Required<Form>) => {

    formData = { ...formData, SiteList: sitesArray };

    if (editMode) {
      const { error } = await insertItineraryRequest({
        OriginalItineraryID: storeFormValues?.OriginalItineraryID,
        shopID: selectedShop.id,
        tripName: formData.Name,
        BookingPage: formData.Link,
        price: formData.Price,
        startDate: formData.Start,
        endDate: formData.End,
        description: formData.Details,
        siteList: formData.SiteList
      }, "Edit");
      if (error) {
        showError("We were unable to save your submission, please try again later");
        return;
      }
      setSitesArray([]);
      showSuccess(`Your Trip Edits for: ${formData.Name} has been sucessfuly submitted! Please allow up to 24 hours for us to review and approve it.`);

    } else {
      const { error } = await insertItinerary({
        shopID: selectedShop.id,
        tripName: formData.Name,
        BookingPage: formData.Link,
        price: formData.Price,
        startDate: formData.Start,
        endDate: formData.End,
        description: formData.Details,
        siteList: formData.SiteList
      });
      if (error) {
        showError("We were unable to save your submission, please try again later");
        return;
      }
      setFormValues(null);
      setSitesArray([]);
      showSuccess(`Your Dive Trip: ${formData.Name} has been sucessfuly submitted!`);

    }
  };

  const removeFromSitesArray = async (siteIdNo: number, siteList: number[]) => {

    const index = siteList.indexOf(siteIdNo);
    if (index > -1) {
      siteList.splice(index, 1);
    }
    setSitesArray(siteList);
    const indexLocal = storeFormValues.siteList.indexOf(siteIdNo);
    if (indexLocal > -1) {
      storeFormValues.siteList.splice(index, 1);
    }
    getTripDiveSites(siteList);
  };

  useEffect(() => {
    if (levelTwoScreen) {
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

  const handleDatePickerConfirm = (formData: Required<Form>) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setFormValues({ ...formData, [dateType]: formattedDate });
    hideDatePicker();
  };

  useEffect(() => {
    if (itineraryInfo) {
      setFormValues({
        Name: itineraryInfo?.tripName || storeFormValues?.Name,
        Link: itineraryInfo?.BookingPage || storeFormValues?.Link,
        Price: itineraryInfo?.price || storeFormValues?.Price,
        Start: itineraryInfo?.startDate || storeFormValues?.Start,
        End: itineraryInfo?.endDate || storeFormValues?.End,
        Details: itineraryInfo?.description || storeFormValues?.Details,
        OriginalItineraryID: itineraryInfo?.id || storeFormValues?.OriginalItineraryID,
      });
    }
  }, [itineraryInfo]);

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
        Name: storeFormValues?.Name,
        Link: storeFormValues?.Link,
        Price: storeFormValues?.Price,
        Start: storeFormValues?.Start,
        End: storeFormValues?.End,
        Details: storeFormValues?.Details,
      }}
    />
  );
}