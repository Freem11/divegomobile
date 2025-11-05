import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useContext } from "react";

import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { ModalSelectContext } from "../../../contexts/modalSelectContext";
import { LevelTwoScreenContext } from "../../../contexts/levelTwoScreenContext";

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

  const mapRef = useMapStore((state) => state.mapRef);
  const mapAction = useMapStore((state) => state.actions);
  const navProps = useMapStore((state) => state.navProps);

  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setChosenModal } = useContext(ModalSelectContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const onPress = async() => {
    const latestFormValues = useMapStore.getState().formValues;

    const camera = await mapRef.getCamera();
    if (navProps.itemId === 1){
      setActiveScreen("DiveSiteUploadScreen");
      setLevelTwoScreen(true);
      setChosenModal(null);
    } else {
      setActiveScreen("PartnerRequestScreen");
      setLevelTwoScreen(true);
      setChosenModal(null);
    }

    mapAction.setFormValues({ ...latestFormValues, Latitude: camera.center.latitude, Longitude: camera.center.longitude });
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
