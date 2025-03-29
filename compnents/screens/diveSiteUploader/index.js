import React, { useContext } from "react";
import { Keyboard } from "react-native";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { DiveSpotContext } from "../../contexts/diveSpotContext";
import { insertDiveSiteWaits } from "../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { ActiveConfirmationIDContext } from "../../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";

import DiveSiteUploaderView from './view';

export default function DiveSiteUploader() {
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);

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
        setAddSiteVals({
          ...addSiteVals,
          Latitude: location.coords.latitude.toString(),
          Longitude: location.coords.longitude.toString(),
        });
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    setChosenModal("DiveSite");
    setMapHelper(true);
    setMapConfig(1);
    setLevelTwoScreen(false);
  };

  const onClose = async () => {
    setLevelTwoScreen(false);
    setAddSiteVals({
      ...addSiteVals,
      Site: "",
      Latitude: "",
      Longitude: "",
    });
  };

  return (
    <DiveSiteUploaderView
      addSiteVals={addSiteVals}
      setAddSiteVals={setAddSiteVals}
      onClose={onClose}
      onSubmit={onSubmit}
      onNavigate={onNavigate}
      getCurrentLocation={getCurrentLocation}
    />
  )
}