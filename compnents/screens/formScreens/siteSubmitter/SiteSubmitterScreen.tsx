import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Keyboard, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { useUserProfile } from "../../../../store/user/useUserProfile";
import { RootStackParamList } from "../../../../providers/navigation";
import { getCurrentCoordinates } from "../../../tutorial/locationTrackingRegistry";
import { useMapStore } from "../../../googleMap/useMapStore";

import SiteSubmitterPageView from "./siteSubmitter";
import { Form } from "./form";

export default function SiteSubmitterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { userProfile } = useUserProfile();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [siteInfo, setSiteInfo] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const mapAction = useMapStore((state) => state.actions);
  const storeFormValues = useMapStore((state) => state.formValues);

  const { control, setValue, handleSubmit, watch, formState: { isSubmitting, errors }, trigger } = useForm<Form>({
    mode: "onChange",
    reValidateMode: "onChange",
    values: {
      Site: "",
      Latitude: 0,
      Longitude: 0
    }
  });

  const onSubmit = async (data: Form) => {
    console.log("data", data);
  };

  const handleGetLocation = () => {
    const currentValues = watch() as Required<Form>;
    getCurrentLocation(currentValues);
  };

  const getCurrentLocation = async (formData: Required<Form>) => {
    Keyboard.dismiss();
    try {
      const location = await getCurrentCoordinates();
      console.log("location", location);
      console.log("formData", formData);
      console.log("storeFormValues", storeFormValues);
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
        values={{
          SiteName: storeFormValues?.SiteName,
          Latitude: storeFormValues?.Latitude,
          Longitude: storeFormValues?.Longitude
        }}
      />
    </View>
  );
}
