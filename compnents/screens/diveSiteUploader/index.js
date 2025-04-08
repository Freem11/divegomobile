import React, { useContext, useState } from "react";
import { Keyboard } from "react-native";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";

import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { MapHelperContext } from "../../contexts/mapHelperContext";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { ModalSelectContext } from "../../contexts/modalSelectContext";
import { insertDiveSiteWaits } from "../../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";
import DiveSiteUploaderView from './view';

export default function DiveSiteUploader() {
  const { setMapHelper } = useContext(MapHelperContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setChosenModal } = useContext(ModalSelectContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const [deviceLocation, setDeviceLocation] = useState(null);
  // const [deviceLocation, setDeviceLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const onSubmit = async (data) => {
      insertDiveSiteWaits(data);
      setConfirmationType("Dive Site");
      setConfirmationModal(true);
  };

  const getCurrentLocation = async () => {
    Keyboard.dismiss();
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setDeviceLocation({
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
  };

  return (
    <DiveSiteUploaderView
      onClose={onClose}
      onSubmit={onSubmit}
      onNavigate={onNavigate}
      getCurrentLocation={getCurrentLocation}
      values={{
        Latitude: deviceLocation?.Latitude,
        Longitude: deviceLocation?.Longitude,
      }}
    />
  )
}