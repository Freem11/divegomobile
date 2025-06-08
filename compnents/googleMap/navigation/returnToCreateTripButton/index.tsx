import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { buttonTextAlt, primaryButtonAlt } from "../../../styles";


export function ReturnToCreateTripButton() {
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

  return (
    <TouchableWithoutFeedback onPress={() => {} }>
      <View style={styles.lowerButtonWrapper}>
                  <Text style={styles.lowerButtonText}>
                    {"Set Pin"}
                  </Text>
                </View>
    </TouchableWithoutFeedback>
  );
}