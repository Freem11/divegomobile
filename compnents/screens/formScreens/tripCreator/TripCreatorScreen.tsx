import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Keyboard, View } from "react-native";
import { useForm } from "react-hook-form";

import { RootStackParamList } from "../../../../providers/navigation";
import { ItineraryItem } from "../../../../entities/itineraryItem";
import {
  getItineraryDiveSiteByIdArray,
  getTripById,
  insertItinerary,
  insertItineraryRequest
} from "../../../../supabaseCalls/itinerarySupabaseCalls";
import { EditModeContext } from "../../../contexts/editModeContext";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { useMapStore } from "../../../googleMap/useMapStore";
import { MapConfigurations, ScreenReturn } from "../../../googleMap/types";
import { computeRegionFromCoordinates } from "../../../googleMap/regionCalculator";

import TripCreatorPageView from "./tripCreator";
import { Form } from "./form";

type TripCreatorScreenProps = {
  route: RouteProp<RootStackParamList, "TripCreator">;
};

export default function TripCreatorScreen({ route }: TripCreatorScreenProps) {
  const { id, shopId } = route.params;
  const navigation = useNavigation();

  // Context & Store
  const { editMode, setEditMode } = useContext(EditModeContext);
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);

  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const clearFormValues = useMapStore((state) => state.actions.clearFormValues);
  const storeFormValues = useMapStore((state) => state.formValues);
  const setInitConfig = useMapStore((state) => state.actions.setInitConfig);

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
      Name: storeFormValues?.Name || selectedTrip?.tripName || "",
      Link: storeFormValues?.Link || selectedTrip?.BookingPage || "",
      Price: storeFormValues?.Price || selectedTrip?.price || "",
      Start: storeFormValues?.Start || selectedTrip?.startDate || "",
      End: storeFormValues?.End || selectedTrip?.endDate || "",
      Details: storeFormValues?.Details || selectedTrip?.description || "",
      SiteList: sitesArray
    }
  });

  const performCleanup = useCallback(() => {
    setSitesArray([]);
    clearFormValues();
    setEditMode(false);
  }, [setSitesArray, clearFormValues, setEditMode]);

  // THE GUARD
  useFocusEffect(
    useCallback(() => {
      return () => {
        const state = navigation.getState();
        const nextRoute = state?.routes[state.index];
        // If the user isn't going to the Map, clean up everything
        if (nextRoute?.name !== "GoogleMap") {
          performCleanup();
        }
      };
    }, [navigation, performCleanup])
  );

  useEffect(() => {
    setValue("SiteList", sitesArray);
    if (sitesArray.length > 0) {
      getTripDiveSites(sitesArray);
    }
  }, [sitesArray]);

  const removeFromSitesArray = (siteIdNo: number, siteList: number[]) => {
    const newSiteList = siteList.filter(id => id !== siteIdNo);
    setSitesArray(newSiteList);
  };

  const showDatePicker = (value: string) => {
    setDateType(value);
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => setDatePickerVisible(false);

  useEffect(() => {
    if (id) {
      getDiveSiteinfo();
    }
  }, [id]);

  const getDiveSiteinfo = async () => {
    const tripInfo = await getTripById(id);
    if (tripInfo?.[0]) {
      setSelectedTrip(tripInfo[0]);
      setSitesArray(tripInfo[0].siteList);
      setEditMode(true);
    }
  };

  const getTripDiveSites = async (siteIds: number[]) => {
    try {
      const success = await getItineraryDiveSiteByIdArray(siteIds);
      if (success) setTripDiveSites(success);
    } catch (e) {
      console.log("Error fetching sites:", e.message);
    }
  };

  const handleMapFlip = async () => {
    const currentValues = watch();
    setInitConfig(MapConfigurations.TripBuild);
    // Use site coordinates only — avoid bridge call to mapRef (stale on 2nd try and can cause NSInvalidArgumentException)
    const coords = (tripDiveSites || [])
      .filter((s) => sitesArray.includes(s.id))
      .map((s) => ({ lat: s.lat, lng: s.lng }));
    const region = computeRegionFromCoordinates(coords);
    if (region) setMapRegion(region);

    setFormValues({ ...currentValues, SiteList: sitesArray });
    setMapConfig(MapConfigurations.TripBuild, {
      pageName: ScreenReturn.TripCreator as unknown as string,
      itemId: 1
    });

    navigation.navigate("GoogleMap" as any);
  };

  const onSubmit = async (data: Form) => {
    const call = editMode ? insertItineraryRequest : insertItinerary;
    const payload = {
      shopID: shopId,
      tripName: data.Name,
      BookingPage: data.Link,
      price: data.Price,
      startDate: data.Start,
      endDate: data.End,
      description: data.Details,
      siteList: data.SiteList,
      ...(editMode && { OriginalItineraryID: data.Id })
    };

    try {
      await (editMode ? insertItineraryRequest(payload as any, "Edit") : insertItinerary(payload as any));
      setIsCompleted(true);
      setTimeout(() => {
        performCleanup();
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.error("Submission failed:", error);
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
        selectedTrip={selectedTrip!}
        tripDiveSites={tripDiveSites!}
        removeFromSitesArray={removeFromSitesArray}
        sitesArray={sitesArray}
        editMode={editMode}
        setEditMode={setEditMode}
        useMapFlip={handleMapFlip}
      />
    </View>
  );
}