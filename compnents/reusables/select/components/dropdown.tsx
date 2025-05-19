import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Values } from '..';
import { moderateScale } from "react-native-size-matters";

export type DropdownProps = {
  options: Values;
  children: React.ReactNode;
  searchText: string;
  shouldDisplayCreate: boolean;
  createItem: (value: string) => void;
};

export default function Dropdown(props: DropdownProps) {
  return (
    <View style={styles.dropdown}>
      <View style={styles.optionList}>
        {props.children}

        {props.shouldDisplayCreate && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => props.createItem(props.searchText)}
          >
            <Text>
              Create <Text style={styles.searchTerm}>{props.searchText}</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionList: {
    flexDirection: 'column',
  },
  createButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  searchTerm: {
    fontWeight: 'bold',
  },
});
