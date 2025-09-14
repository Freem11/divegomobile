import React, { useContext } from "react";
import { Keyboard } from "react-native";
import { showError, showSuccess } from "../../toast";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import { insertDiveSiteWaits } from "../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import DiveSiteUploaderView from './view';
import { useMapStore } from "../../googleMap/useMapStore";
import { Form } from "./form";
import { useUserProfile } from "../../../store/user/useUserProfile";

type SiteSubmitterProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
};

export default function DiveSiteUploader({
  closeParallax,
  restoreParallax,
}: SiteSubmitterProps) {

  const userProfile = useUserProfile();

  const mapAction = useMapStore((state) => state.actions)
  const storeFormValues = useMapStore((state) => state.formValues);

  const onSubmit = async (formData: Required<Form>) => {
    const { error } = await insertDiveSiteWaits({
      name: formData.Site,
      lat: formData.Latitude,
      lng: formData.Longitude,
      UserID: userProfile.UserID
    }); 
    if (error){
      showError("We were unable to save your submission, please try again later")
      return;
    } 
      showSuccess(`${formData.Site} has been sucessfuly submitted! Please allow up to 24 hours for us to review and approve it.`);
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
        })
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
  )

}