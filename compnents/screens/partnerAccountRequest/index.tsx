import React, { useContext, useState } from "react";
import { Keyboard } from "react-native";

import { showError, showSuccess } from "../../toast";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import { useMapStore } from "../../googleMap/useMapStore";
import { createPartnerAccountRequest } from "../../../supabaseCalls/partnerSupabaseCalls";
import { useUserProfile } from "../../../store/user/useUserProfile";

import PartnerAccountRequestPageView from "./view";
import { Form } from "./form";

type PartnerAccountRequestPageProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
};

export default function PartnerAccountRequestPage({
  closeParallax,
  restoreParallax,
}: PartnerAccountRequestPageProps) {

  const { userProfile } = useUserProfile();

  const mapAction = useMapStore((state) => state.actions);
  const storeFormValues = useMapStore((state) => state.formValues);

  const onSubmit = async(formData: Required<Form>) => {
    const { error } = await createPartnerAccountRequest({
      webpageLink : formData.URL,
      businessName: formData.OrgName,
      latitude: formData.Latitude,
      longitude: formData.Longitude,
      userId: userProfile.UserID
    });

    if (error){
      showError("We were unable to save your submission, please try again later");
      return;
    }
    showSuccess(`Partner request for ${formData.OrgName} has been sucessfuly submitted! We will contact you via email, with our descision.`);
  };

  const getCurrentLocation = async(formData: Required<Form>) => {
    Keyboard.dismiss();
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        mapAction.setFormValues({
          OrgName: formData.OrgName || storeFormValues?.OrgName,
          URL: formData.URL || storeFormValues?.URL,
          Latitude: location.coords.latitude,
          Longitude: location.coords.longitude
        });
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  return (
    <PartnerAccountRequestPageView
      onSubmit={onSubmit}
      getCurrentLocation={getCurrentLocation}
      closeParallax={closeParallax}
      restoreParallax={restoreParallax}
      values={{
        OrgName: storeFormValues?.OrgName,
        URL: storeFormValues?.URL,
        Latitude: storeFormValues?.Latitude,
        Longitude: storeFormValues?.Longitude,
      }}
    />
  );
}