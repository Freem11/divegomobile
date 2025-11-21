import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { useTripCreatorNavigation } from "../../../screens/formScreens/tripCreator/types";
import { SitesArrayContext } from "../../../contexts/sitesArrayContext";

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

export function ReturnToCreateTripButton() {
  const mapAction = useMapStore((state) => state.actions);
  const storeFormValues = useMapStore((state) => state.formValues);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const tripCreatorNavigation = useTripCreatorNavigation();
  const { sitesArray } = useContext(SitesArrayContext);

  const onPress = async () => {
    mapAction.setFormValues({ ...storeFormValues, Sitelist: sitesArray });
    tripCreatorNavigation.goBack();
    setMapConfig(0, { pageName: "", itemId: 0 });
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.lowerButtonWrapper}>
        <Text style={styles.lowerButtonText}>
          {"Sites Chosen"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}