import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import {
  primaryButton,
  buttonText,
} from '../compnents/styles';

export default function DrawerContent(props) {
const { boxheight, lowerBound} = props;
  return (
    <View style={styles.masterBox}>
    
    <TouchableWithoutFeedback
          onPress={() => boxheight.value = lowerBound}
        >
          <View style={styles.mapButtonWrapper}>
            <Text style={styles.mapButtonText}>
                Map
            </Text>
          </View>
        </TouchableWithoutFeedback>

    </View>
  );
}

const styles = StyleSheet.create({
  masterBox: {
    width: "100%",
    height: "100%",
    alignItems: "center"
  },
  mapButtonWrapper: [
    primaryButton,
    {
      position: 'absolute',
      top: 800,
      alignItems: "center",
      textAlign: "center",
      zIndex: 20,
      width: '25%',
      height: '5%'
    },
  ],
  mapButtonText: buttonText,
})