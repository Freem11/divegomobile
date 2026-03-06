import React from "react";
import { useTranslation } from "react-i18next";

import ContributionLaunchPadView from "./launchPad";
import { useContributionLaunchPadNavigation } from "./types";

export default function ContributionLaunchPad() {
  const navigation = useContributionLaunchPadNavigation();
  const { t } = useTranslation();

  const handleSiteSubmitterMove = async () => {
    navigation.navigate("SiteSubmitter");
  };

  const handleDeviceSyncMove = async () => {
    navigation.navigate("SyncScreen");
  };

  return (
    <ContributionLaunchPadView
      handleDeviceSyncMove={handleDeviceSyncMove}
      handleSiteSubmitterMove={handleSiteSubmitterMove}
    />
  );

}