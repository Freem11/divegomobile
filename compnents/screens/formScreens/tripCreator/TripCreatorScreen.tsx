import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { getDiveSiteById } from "../../../../supabaseCalls/diveSiteSupabaseCalls";
import { RootStackParamList } from "../../../../providers/navigation";
import { ItineraryItem } from "../../../../entities/itineraryItem";
import { getItineraryDiveSiteByIdArray, getTripById, insertItinerary, insertItineraryRequest } from "../../../../supabaseCalls/itinerarySupabaseCalls";
import { EditModeContext } from "../../../contexts/editModeContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { useMapStore } from "../../../googleMap/useMapStore";

import TripCreatorPageView from "./tripCreatorNew";
import { Form } from "./form";

type TripCreatorScreenProps = {
  route: RouteProp<RootStackParamList, "TripCreator">;
};

export default function TripCreatorScreen({ route }: TripCreatorScreenProps) {
  const { selectedDiveSite, id, shopId } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedTrip, setSelectedTrip] = useState<ItineraryItem>();
  const [tripDiveSites, setTripDiveSites] = useState<DiveSiteWithUserName[]>();
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const storeFormValues = useMapStore((state) => state.formValues);

  const { editMode, setEditMode } = useContext(EditModeContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [dateType, setDateType] = useState("");

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      Id: selectedTrip?.id,
      Name: selectedTrip?.tripName,
      Link: selectedTrip?.BookingPage,
      Price: selectedTrip?.price,
      Start: selectedTrip?.startDate,
      End: selectedTrip?.endDate,
      Details: selectedTrip?.description,
      SiteList: selectedTrip?.siteList
    }
  });

  useEffect(() => {
    setFormValues({ ...storeFormValues, SiteList: sitesArray });
    setValue("SiteList", sitesArray);
    getTripDiveSites(sitesArray);

  }, [sitesArray]);

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

  const showDatePicker = (value: string) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  useEffect(() => {
    getDiveSiteinfo();
    if (!id) {
      setSitesArray([]);
    }
  }, [id]);

  const getDiveSiteinfo = async () => {
    const tripInfo = await getTripById(id);
    setSelectedTrip(tripInfo[0]);
    setSitesArray(tripInfo[0].siteList);
    if (tripInfo) {
      setEditMode(true);
    }

  };

  useEffect(() => {
    if (selectedTrip) {
      getTripDiveSites(selectedTrip.siteList);
    }

  }, [selectedTrip]);

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

  const handleCreate = async (data: Form) => {
    try {
      await insertItinerary({
        shopID: data.Id,
        tripName: data.Name,
        BookingPage: data.Link,
        price: data.Price,
        startDate: data.Start,
        endDate: data.End,
        description: data.Details,
        siteList: data.SiteList
      });

    } catch (error) {
      console.error("Form submission failed due to photo upload errors:", error);
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const handleEdit = async (data: Form) => {
    try {
      await insertItineraryRequest({
        OriginalItineraryID: data.Id,
        shopID: shopId,
        tripName: data.Name,
        BookingPage: data.Link,
        price: data.Price,
        startDate: data.Start,
        endDate: data.End,
        description: data.Details,
        siteList: data.SiteList
      }, "Edit");
    } catch (error) {
      console.error("Trip edit submission failed:", error);
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const onSubmit = async (data: Form) => {
    if (editMode) {
      await handleEdit(data);
    } else {
      await handleCreate(data);
    }

  };

  const getDiveSiteInfo = async (siteId: number) => {
    if (siteId) {
      const diveSiteInfo = await getDiveSiteById(siteId);
      setSiteInfo(diveSiteInfo[0]);
    }
  };

  useEffect(() => {
    void getDiveSiteInfo(selectedDiveSite);
  }, [selectedDiveSite]);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <TripCreatorPageView
        datePickerVisible={datePickerVisible}
        dateType={dateType}
        showDatePicker={showDatePicker}
        hideDatePicker={hideDatePicker}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        setValue={setValue}
        isSubmitting={isSubmitting}
        errors={errors}
        watch={watch}
        isCompleted={isCompleted}
        trigger={trigger}
        selectedTrip={selectedTrip}
        tripDiveSites={tripDiveSites}
        removeFromSitesArray={removeFromSitesArray}
        sitesArray={sitesArray}
        editMode={editMode}
        setEditMode={setEditMode}
      />
    </View>
  );
}
