import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";
import { useDiveSiteNavigation } from "../../../screens/diveSite/types";
import { useDiveShopNavigation } from "../../../screens/diveShop/types";
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

export function ReturnToShopButton() {
  const diveSiteNavigation = useDiveSiteNavigation();
  const diveShopNavigation = useDiveShopNavigation();
  const navProps = useMapStore((state) => state.navProps);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { setSitesArray } = useContext(SitesArrayContext);

  const onPress = async() => {

    if (navProps.pageName === "DiveSite") {
      diveSiteNavigation.goBack();
    } else {
      diveShopNavigation.goBack();
    };
    setMapConfig(MapConfigurations.Default, { pageName: "", itemId: 0 });
    setSitesArray([]);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.lowerButtonWrapper}>
        <Text style={styles.lowerButtonText}>
          {navProps.pageName === "DiveSite" ? "Return to Dive Site" : "Return to Dive Centre"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
