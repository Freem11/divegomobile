import React, { useContext } from "react";
import { Keyboard } from "react-native";

import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import { insertDiveSiteWaits } from "../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { useMapStore } from "../../googleMap/useMapStore";
import { UserProfileContext } from "../../contexts/userProfileContext";

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

  const { profile } = useContext(UserProfileContext);

  const mapAction = useMapStore((state) => state.actions)

  const draggablePoint = useMapStore((state) => state.draggablePoint);
  const deviceLocation = null//todo

  const onSubmit = async(formData: Required<Form>) => {
    const { error } = await insertDiveSiteWaits({
      name: formData.Site,
      lat: formData.Latitude,
      lng: formData.Longitude,
      UserID: profile.UserID
    }); 
  };

  const getCurrentLocation = async() => {
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
    <DiveSiteUploaderView
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