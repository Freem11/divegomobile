import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { ModalSelectContext } from "../../../contexts/modalSelectContext";
import { LevelTwoScreenContext } from "../../../contexts/levelTwoScreenContext";
import { useAppNavigation } from "../../../mapPage/types";

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
  const navigation = useAppNavigation();
  const mapRef = useMapStore((state) => state.mapRef);
  const mapAction = useMapStore((state) => state.actions);
  const navProps = useMapStore((state) => state.navProps);
  const storeFormValues = useMapStore((state) => state.formValues);

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setChosenModal } = useContext(ModalSelectContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const onPress = async () => {
    const camera = await mapRef.getCamera();
    if (navProps.pageName === 1) {
      navigation.navigate("SiteSubmitter");
    }
    if (navProps.pageName === 2) {
      navigation.navigate("PartnerRequestUpgrade");
    }

    mapAction.setFormValues({ ...storeFormValues, Latitude: camera.center.latitude, Longitude: camera.center.longitude });
    mapAction.setMapConfig(0, { pageName: "", itemId: 0 });

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
}
