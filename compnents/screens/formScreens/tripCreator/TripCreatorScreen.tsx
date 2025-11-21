import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { getDiveSiteById } from "../../../../supabaseCalls/diveSiteSupabaseCalls";
import { useUserProfile } from "../../../../store/user/useUserProfile";
import { RootStackParamList } from "../../../../providers/navigation";
import { showError } from "../../../toast";
import { ItineraryItem } from "../../../../entities/itineraryItem";
import { getItineraryDiveSiteByIdArray, getTripById } from "../../../../supabaseCalls/itinerarySupabaseCalls";
import { EditModeContext } from "../../../contexts/editModeContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { TripSitesContext } from "../../../contexts/tripSitesContext";
import { DiveSiteWithUserName } from "../../../../entities/diveSite";

import TripCreatorPageView from "./tripCreatorNew";
import { Form } from "./form";

type TripCreatorScreenProps = {
  route: RouteProp<RootStackParamList, "TripCreator">;
};

export default function TripCreatorScreen({ route }: TripCreatorScreenProps) {
  const { selectedDiveSite, reviewToEdit, id } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedTrip, setSelectedTrip] = useState<ItineraryItem>();
  const [tripDiveSites, setTripDiveSites] = useState<DiveSiteWithUserName[]>();

  const { editMode, setEditMode } = useContext(EditModeContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  // const { tripDiveSites, setTripDiveSites } = useContext(TripSitesContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [dateType, setDateType] = useState("");

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      Name: selectedTrip?.tripName,
      Link: selectedTrip?.BookingPage,
      Price: selectedTrip?.price,
      Start: selectedTrip?.startDate,
      End: selectedTrip?.endDate,
      Details: selectedTrip?.description
    }
  });

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
  }, [id]);

  const getDiveSiteinfo = async () => {
    if (id) {
      const tripInfo = await getTripById(id);
      setSelectedTrip(tripInfo[0]);
      setSitesArray(tripInfo[0].siteList);
      if (tripInfo) {
        setEditMode(true);
      }
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
      //code

    } catch (error) {
      console.error("Form submission failed due to photo upload errors:", error);
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const handleUpdate = async (data: Form) => {

    try {
      //code

    } catch (error) {
      console.error("Trip update failed:", error);
      showError("Failed to update trip");
    } finally {
      setIsCompleted(true);
      setTimeout(() => navigation.goBack(), 3000);
    }
  };

  const onSubmit = async (data: Form) => {
    if (reviewToEdit) {
      await handleUpdate(data);
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
      />
    </View>
  );
}
