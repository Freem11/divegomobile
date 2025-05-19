import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AccessibilityRole,
} from 'react-native';
import { Option } from '..';

export type DropdownItemProps = {
  option: Option;
  selected: boolean;
  onSelect: (key: string) => void;
};

export default function DropdownItem({ option, selected, onSelect }: DropdownItemProps) {
  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        onPress={() => onSelect(option.key)}
        accessibilityRole="button" // or "option" if using accessibilityStates
        accessibilityState={{ selected }}
        style={[styles.itemButton, selected && styles.itemSelected]}
      >
        <Text style={styles.itemText}>{option.label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    marginVertical: 0,
  },
  itemButton: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  itemSelected: {
    backgroundColor: '#cce5ff',
  },
  itemText: {
    fontSize: 16,
  },
});
