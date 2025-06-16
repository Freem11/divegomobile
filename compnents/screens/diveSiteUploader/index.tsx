import React, { useContext } from "react";
import { Keyboard } from "react-native";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import { DiveSpotContext } from "../../contexts/diveSpotContext";
import { insertDiveSiteWaits } from "../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { ActiveConfirmationIDContext } from "../../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";

import DiveSiteUploaderView from './view';
import { useMapStore } from "../../googleMap/useMapStore";

type SiteSubmitterProps = {
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
};

export default function DiveSiteUploader({
  closeParallax,
  restoreParallax,
}: SiteSubmitterProps) {

  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  
  const mapAction = useMapStore((state) => state.actions)

  const draggablePoint = useMapStore((state) => state.draggablePoint);
  const deviceLocation = null//todo

  const onSubmit = async () => {
    const { Site, Latitude, Longitude } = addSiteVals;
    if (Site && Latitude && Longitude) {
      insertDiveSiteWaits(addSiteVals);
      setAddSiteVals({
        ...addSiteVals,
        Site: "",
        Latitude: "",
        Longitude: "",
      });
      setConfirmationType("Dive Site");
      setActiveConfirmationID("ConfirmationSuccess");
    } else {
      setActiveConfirmationID("ConfirmationCaution");
    }
    setConfirmationModal(true);
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