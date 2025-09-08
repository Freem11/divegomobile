import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

import { styles } from './styles';

interface HeaderProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const NavigationHeader = ({ title, subtitle, left, right }: HeaderProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.sideContainer}>
          {left}
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.sideContainer}>
          {right}
        </View>
      </View>
    </SafeAreaView>
  );
};
