import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Keyboard, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { RootStackParamList } from "../../../../providers/navigation";
import { ItineraryItem } from "../../../../entities/itineraryItem";
import { getItineraryDiveSiteByIdArray, getTripById, insertItinerary, insertItineraryRequest } from "../../../../supabaseCalls/itinerarySupabaseCalls";
import { EditModeContext } from "../../../contexts/editModeContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { useMapStore } from "../../../googleMap/useMapStore";

import TripCreatorPageView from "./tripCreator";
import { Form } from "./form";

type TripCreatorScreenProps = {
  route: RouteProp<RootStackParamList, "TripCreator">;
};

export default function TripCreatorScreen({ route }: TripCreatorScreenProps) {
  const { id, shopId } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Context & Store
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const clearFormValues = useMapStore((state) => state.actions.clearFormValues);
  const storeFormValues = useMapStore((state) => state.formValues);

  // Local State
  const [selectedTrip, setSelectedTrip] = useState<ItineraryItem>();
  const [tripDiveSites, setTripDiveSites] = useState<DiveSiteWithUserName[]>();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
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
      SiteList: sitesArray // Priority given to context sitesArray
    }
  });

  /**
   * CLEANUP LOGIC
   * Resets both the Global Context and the Map Store
   */
  const performCleanup = useCallback(() => {
    setSitesArray([]);
    clearFormValues();
    setEditMode(false);
  }, [setSitesArray, clearFormValues, setEditMode]);

  /**
   * NAVIGATION LISTENER
   * Triggers when the user leaves the screen.
   * If they go anywhere EXCEPT the GoogleMap, we wipe the data.
   */
  useFocusEffect(
    useCallback(() => {
      return () => {
        const state = navigation.getState();
        const nextRoute = state.routes[state.index];

        // Only clear if the user is NOT navigating to the map to pick sites
        if (nextRoute?.name !== "GoogleMap") {
          performCleanup();
        }
      };
    }, [navigation, performCleanup])
  );

  // Sync sites from context to form and fetch info for display
  useEffect(() => {
    setFormValues({ ...storeFormValues, SiteList: sitesArray });
    setValue("SiteList", sitesArray);
    if (sitesArray.length > 0) {
      getTripDiveSites(sitesArray);
    }
  }, [sitesArray]);

  const removeFromSitesArray = async (siteIdNo: number, siteList: number[]) => {
    const newSiteList = siteList.filter(id => id !== siteIdNo);
    setSitesArray(newSiteList);
    getTripDiveSites(newSiteList);
  };

  const showDatePicker = (value: string) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // Initial Load Logic
  useEffect(() => {
    if (id) {
      getDiveSiteinfo();
    } else {
      // If we don't have an ID and we aren't returning from the map, reset
      if (!storeFormValues.Name) {
        setSitesArray([]);
        setEditMode(false);
      }
    }
  }, [id]);

  const getDiveSiteinfo = async () => {
    const tripInfo = await getTripById(id);
    if (tripInfo && tripInfo[0]) {
      setSelectedTrip(tripInfo[0]);
      setSitesArray(tripInfo[0].siteList);
      setEditMode(true);
    }
  };

  const getTripDiveSites = async (siteIds: number[]) => {
    if (!siteIds || siteIds.length === 0) {
      setTripDiveSites([]);
      return;
    }
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
        shopID: shopId,
        tripName: data.Name,
        BookingPage: data.Link,
        price: data.Price,
        startDate: data.Start,
        endDate: data.End,
        description: data.Details,
        siteList: data.SiteList
      });
      setIsCompleted(true);
      setTimeout(() => {
        performCleanup(); // Clear before leaving
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.error("Form submission failed:", error);
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
      setIsCompleted(true);
      setTimeout(() => {
        performCleanup(); // Clear before leaving
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.error("Trip edit submission failed:", error);
    }
  };

  const onSubmit = async (data: Form) => {
    if (editMode) {
      await handleEdit(data);
    } else {
      await handleCreate(data);
    }
  };

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