import React from "react";
import { useTranslation } from "react-i18next";

import { useMapStore } from "../../googleMap/useMapStore";
import { MapConfigurations, ScreenReturn } from "../../googleMap/types";
import { getCurrentCoordinates } from "../../tutorial/locationTrackingRegistry";
import { useAppNavigation } from "../../mapPage/types";

import ContributionLaunchPadView from "./launchPad";

export default function ContributionLaunchPad() {
  const mainNavigation = useAppNavigation();
  const mapRef = useMapStore((state) => state.mapRef);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setMapRegion = useMapStore((state) => state.actions.setMapRegion);
  const setInitConfig = useMapStore((state) => state.actions.setInitConfig);
  const { t } = useTranslation();

  const handleSiteSubmitterMove = async () => {
    mainNavigation.navigate("SiteSubmitter");
  };

  const handleDeviceSyncMove = async () => {
    mainNavigation.navigate("SyncScreen");
  };

  const handleMapFlip = async () => {

    if (mapRef) {
      setInitConfig(MapConfigurations.DiveSiteSearch);

      const { coords } = await getCurrentCoordinates();

      requestAnimationFrame(() => {
        setMapRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1
        });
        setMapConfig(MapConfigurations.DiveSiteSearch);
        mainNavigation.navigate("GoogleMap");
      });
    }
  };

  return (
    <ContributionLaunchPadView
      handleDeviceSyncMove={handleDeviceSyncMove}
      handleSiteSubmitterMove={handleSiteSubmitterMove}
      handleMapFlip={handleMapFlip}
    />
  );

}