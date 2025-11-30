import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { useDiveSiteNavigation } from "../../../screens/diveSite/types";
import { usePartnerRequestNavigation } from "../../../screens/partnerAccountRequest/types";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { MapConfigurations } from "../../types";

const styles = StyleSheet.create({
  lowerButtonText: buttonTextAlt,
  lowerButtonWrapper: [
    primaryButtonAlt,
    {
      alignItems: "center",
      textAlign: "center",
      zIndex: 2,
    },
  ],
});

export function ReturnToSiteSubmitterButton() {
  const navProps = useMapStore((state) => state.navProps);
  const mapRef = useMapStore((state) => state.mapRef);
  const mapAction = useMapStore((state) => state.actions);
  const storeFormValues = useMapStore((state) => state.formValues);
  const siteSubmitterNavigation = useDiveSiteNavigation();
  const partnerRequestNavigation = usePartnerRequestNavigation();
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);

  const onPress = async () => {

    const camera = await mapRef.getCamera();

    if (navProps.pageName === "PartnerRequestPage") {
      partnerRequestNavigation.goBack();
    } else {
      siteSubmitterNavigation.goBack();
    };

    mapAction.setFormValues({ ...storeFormValues, Latitude: camera.center.latitude, Longitude: camera.center.longitude });
    setMapConfig(MapConfigurations.Default, { pageName: "", itemId: 0 });
    setSitesArray([]);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.lowerButtonWrapper}>
        <Text style={styles.lowerButtonText}>
          {"Set Pin"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
