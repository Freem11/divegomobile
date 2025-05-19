import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

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
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    margin: 4,
  },
  label: {
    marginRight: 6,
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
  removeText: {
    fontSize: 14,
    color: '#888',
  },
});
