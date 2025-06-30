import React, { useContext, useState } from "react";
import { Keyboard } from "react-native";
import { showError, showSuccess } from "../../toast";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import { useMapStore } from "../../googleMap/useMapStore";
import { createPartnerAccountRequest } from "../../../supabaseCalls/partnerSupabaseCalls";
import PartnerAccountRequestPageView from "./view";
import { Form } from "./form";
import { UserProfileContext } from "../../contexts/userProfileContext";

type PartnerAccountRequestPageProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
};

export default function PartnerAccountRequestPage({
  closeParallax,
  restoreParallax,
}: PartnerAccountRequestPageProps) {

  const [formVals, setFormVals] = useState({
    businessName: "",
    websiteLink: "",
    latitude: null,
    longitude: null,
    UserId: null,
  });
  
  const mapAction = useMapStore((state) => state.actions)

  const draggablePoint = useMapStore((state) => state.draggablePoint);
  const deviceLocation = null//todo

  const { profile } = useContext(UserProfileContext);
  
  const onSubmit = async (formData: Required<Form>) => {
    const { error } = await createPartnerAccountRequest({
      webpageLink : formData.URL,
      businessName: formData.OrgName,
      latitude: formData.Latitude,
      longitude: formData.Longitude,
      userId: profile.UserId
    }); 

    if (error){
    showError("We were unable to save your submission, please try again later")
    return;
  } 
    showSuccess(`Partner reuqest for ${formData.OrgName} has been sucessfuly submitted! We will contact you via email, with our descision.`);
  };

  const getCurrentLocation = async () => {
    Keyboard.dismiss();
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        mapAction.setDraggablePoint({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        })
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
        Latitude:  draggablePoint ? draggablePoint?.latitude : deviceLocation?.lat,
        Longitude: draggablePoint ? draggablePoint?.longitude : deviceLocation?.lng,
      }}
    />
  )
}