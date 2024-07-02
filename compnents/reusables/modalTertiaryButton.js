import React from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { FontAwesome } from "@expo/vector-icons";

export default function ModalTertiaryButton(props) {
  const { tertButton } = props;

  return (
    <View style={styles.flag}>
      <FontAwesome
        name="flag"
        color="maroon"
        size={moderateScale(24)}
        onPress={tertButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flag: {
    marginRight: moderateScale(20),
  },
});
