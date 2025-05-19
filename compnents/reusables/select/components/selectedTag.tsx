import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { moderateScale } from "react-native-size-matters";
import { colors, fontSizes } from "../../../styles";

type SelectedTagProps = {
  deselctItem: () => void;
  label: string;
};

export default function SelectedTag({ deselctItem, label }: SelectedTagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={deselctItem}
        accessibilityLabel={`Remove ${label}`}
        style={styles.removeButton}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonPressOverlay,
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(4),
    marginBottom: moderateScale(4),
    borderRadius: moderateScale(16),
  },
  label: {
    marginHorizontal: moderateScale(4),
    fontSize: moderateScale(fontSizes.SmallText),
  },
  removeButton: {
    padding: moderateScale(2),
  },
  removeText: {
    fontSize: moderateScale(fontSizes.SmallText),
    color: '#888',
  },
});
