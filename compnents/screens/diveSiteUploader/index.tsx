import React from "react";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";

import { showError, showSuccess } from "../../toast";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import { insertDiveSiteWaits } from "../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { useMapStore } from "../../googleMap/useMapStore";
import { useUserProfile } from "../../../store/user/useUserProfile";

import DiveSiteUploaderView from "./view";
import { Form } from "./form";

type SiteSubmitterProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
};

export default function DiveSiteUploader({
  closeParallax,
  restoreParallax,
}: SiteSubmitterProps) {

  const { t } = useTranslation();
  const { userProfile } = useUserProfile();

  const mapAction = useMapStore((state) => state.actions);
  const storeFormValues = useMapStore((state) => state.formValues);

  const onSubmit = async (formData: Required<Form>) => {
    const { error } = await insertDiveSiteWaits({
      name: formData.Site,
      lat: formData.Latitude,
      lng: formData.Longitude,
      UserID: userProfile.UserID
    });
    if (error) {
      showError("We were unable to save your submission, please try again later");
      return;
    }
    showSuccess(t("DiveSiteAdd.successUpload", { site: formData.Site }));
  };

  const getCurrentLocation = async (formData: Required<Form>) => {
    Keyboard.dismiss();
    try {
      const location = await getCurrentCoordinates();
      if (location) {
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
    <DiveSiteUploaderView
      onSubmit={onSubmit}
      getCurrentLocation={getCurrentLocation}
      closeParallax={closeParallax}
      restoreParallax={restoreParallax}
      values={{
        Site: storeFormValues?.Site,
        Latitude: storeFormValues?.Latitude,
        Longitude: storeFormValues?.Longitude,
      }}
    />
  );

}