import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import { Keyboard, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { getCurrentCoordinates } from "../../../tutorial/locationTrackingRegistry";
import { useMapStore } from "../../../googleMap/useMapStore";
import { MapConfigurations, ScreenReturn } from "../../../googleMap/types";
import { calculateRegionFromBoundaries } from "../../../googleMap/regionCalculator";
import { insertDiveSiteWaits } from "../../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { useUserProfile } from "../../../../store/user/useUserProfile";
import { SiteSubmitterRoutes } from "../SiteSubmitterNavigator";

import { Form } from "./form";
import SiteSubmitterPageView from "./siteSubmitter";
import { useDiveSiteNavigation } from "./types";

export default function SiteSubmitterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const submitterNavigation = useDiveSiteNavigation<SiteSubmitterRoutes>();
  const { userProfile } = useUserProfile();
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const clearFormValues = useMapStore((state) => state.actions.clearFormValues);
  const [isCompleted, setIsCompleted] = useState(false);
  const mapAction = useMapStore((state) => state.actions);
  const storeFormValues = useMapStore((state) => state.formValues);
  const mapRef = useMapStore((state) => state.mapRef);
  const setInitConfig = useMapStore((state) => state.actions.setInitConfig);

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      Site: storeFormValues?.Site || "",
      Latitude: storeFormValues?.Latitude || null,
      Longitude: storeFormValues?.Longitude || null
    }
  });

  const cleanupAndGoBack = useCallback(() => {
    setValue("Site", null);
    setValue("Latitude", null);
    setValue("Longitude", null);
    clearFormValues();
    setIsCompleted(false);
    submitterNavigation.goBack();
  }, [clearFormValues, setValue, submitterNavigation]);

  const onSubmit = async (data: Form) => {
    try {
      await insertDiveSiteWaits({
        name: data.Site,
        lat: data.Latitude,
        lng: data.Longitude,
        UserID: userProfile.UserID
      });
    } catch (error) {
      console.error("Dive site submission failed due error:", error);
    } finally {
      setIsCompleted(true);
      setTimeout(() => cleanupAndGoBack(), 3000);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        const state = navigation.getState();
        const nextRoute = state.routes[state.index];

        if (nextRoute.name !== "GoogleMap") {
          setValue("Site", null);
          setValue("Latitude", null);
          setValue("Longitude", null);

          clearFormValues();
        } else {
        }
      };
    }, [navigation, setValue, clearFormValues])
  );

  const handleGetLocation = () => {
    const currentValues = watch() as Required<Form>;
    getCurrentLocation(currentValues);
  };

  const getCurrentLocation = async (formData: Required<Form>) => {
    Keyboard.dismiss();
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setValue("Latitude", location.coords.latitude);
        setValue("Longitude", location.coords.longitude);
        mapAction.setFormValues({
          Site: formData.Site || storeFormValues?.Site,
          Latitude: location.coords.latitude,
          Longitude: location.coords.longitude
        });
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const handleMapFlip = async () => {
    const currentValues = watch() as Required<Form>;
    if (mapRef) {
      setInitConfig(MapConfigurations.PinDrop);
      const region = await calculateRegionFromBoundaries(mapRef);
      setMapRegion(region);
      submitterNavigation.navigate("GoogleMap");

      setMapConfig(MapConfigurations.PinDrop, { pageName: ScreenReturn.SiteSubmitter as unknown as string, itemId: 1 });
      setFormValues(currentValues);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <SiteSubmitterPageView
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        setValue={setValue}
        isSubmitting={isSubmitting}
        errors={errors}
        watch={watch}
        isCompleted={isCompleted}
        trigger={trigger}
        getCurrentLocation={handleGetLocation}
        useMapFlip={handleMapFlip}
        values={{
          Site: storeFormValues?.Site,
          Latitude: storeFormValues?.Latitude,
          Longitude: storeFormValues?.Longitude
        }}
      />
    </View>
  );
}