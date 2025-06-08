import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useMapStore } from "../../useMapStore";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { useContext } from "react";
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
  const setActiveScreen2 = useActiveScreenStore((state) => state.setActiveScreen);
  const { setChosenModal } = useContext(ModalSelectContext);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);


  const onPress = async () => {
    const camera = await mapRef.getCamera();
    mapAction.setDraggablePoint(camera.center)
    mapAction.setMapConfig(0, 0);

        setActiveScreen2("DiveSiteUploadScreen");
        setLevelTwoScreen(true);
        setChosenModal(null);
      
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
