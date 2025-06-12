import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { buttonTextAlt, primaryButtonAlt } from "../../../styles";
import { useContext } from "react";
import { LevelTwoScreenContext } from "../../../contexts/levelTwoScreenContext";
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { useMapStore } from "../../useMapStore";

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
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  
  const onTripSetNavigate = () => {
    setLevelTwoScreen(true);
    setActiveScreen("TripCreatorScreen");
    setMapConfig(0, 0);
  };

  return (
    <TouchableWithoutFeedback onPress={() => {} }>
      <View style={styles.lowerButtonWrapper}>
                  <Text style={styles.lowerButtonText}>
                    {"Sites Chosen"}
                  </Text>
                </View>
    </TouchableWithoutFeedback>
  );
}