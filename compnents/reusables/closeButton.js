import React, {useState} from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";

export default function CloseButton(props) {
  const { onClose } = props
  const [ isPressed, setIsPressed ] = useState(false);

  return (
      <TouchableWithoutFeedback
        onPress={onClose}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        <View
          style={
            isPressed
              ? styles.closeButtonPressed
              : styles.closeButton
          }
        >
          <FontAwesome name="close" color="#BD9F9F" size={moderateScale(28)} />
        </View>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
});
