import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from "react-native-toast-message";
import { i18n } from "../../i18n";
import { colors } from "../styles";

const VISIBILITY_TIME = 3000;

export const TOAST_MAP = {
  info: 'info',
  error: 'error',
  success: 'success',
  one_button: 'one_button',
  two_buttons: 'two_buttons',
};

export const showWarning = (warningMessage) => {
  Toast.show({
    type: TOAST_MAP.info,
    text1: i18n.t("Toast.warning"),
    text2: warningMessage || i18n.t("Toast.warningMessage"),
    visibilityTime: VISIBILITY_TIME,
  });
};

export const showError = (errorMessage) => {
  Toast.show({
    type: TOAST_MAP.error,
    text1: i18n.t("Toast.error"),
    text2: errorMessage || i18n.t("Toast.errorMessage"),
    visibilityTime: VISIBILITY_TIME,
  });
};

export const showSuccess = (successMessage) => {
  Toast.show({
    type: TOAST_MAP.success,
    text1: i18n.t("Toast.success"), 
    text2: successMessage || i18n.t("Toast.successMessage"),
    visibilityTime: VISIBILITY_TIME,
  });
};

export const toastConfig = {
  [TOAST_MAP.success]: ({ text1, text2 }) => (
    <View style={[styles.base, styles.success]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message} numberOfLines={0}>{text2}</Text>
    </View>
  ),

  [TOAST_MAP.error]: ({ text1, text2 }) => (
    <View style={[styles.base, styles.error]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message} numberOfLines={0}>{text2}</Text>
    </View>
  ),

  [TOAST_MAP.info]: ({ text1, text2 }) => (
    <View style={[styles.base, styles.info]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message} numberOfLines={0}>{text2}</Text>
    </View>
  ),

  [TOAST_MAP.one_button]: ({ text1, text2, props }) => (
    <View style={[styles.base, styles.info]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message} numberOfLines={0}>{text2}</Text>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.button}>OK</Text>
      </TouchableOpacity>
    </View>
  ),

  [TOAST_MAP.two_buttons]: ({ text1, text2, props }) => (
    <View style={[styles.base, styles.warning]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message} numberOfLines={0}>{text2}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={props.onPrimary}>
          <Text style={styles.button}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onSecondary}>
          <Text style={styles.buttonSecondary}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: colors.primaryBlue,
  },
  title: {
    color: colors.themeWhite,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: colors.themeWhite,
    marginBottom: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    includeFontPadding: false,
  },
  button: {
    color: colors.themeWhite,
    fontWeight: 'bold',
    paddingVertical: 6,
  },
  buttonSecondary: {
    color: colors.neutralGrey,
    fontWeight: 'normal',
    paddingVertical: 6,
    marginLeft: 12,
  },
  info: {
    backgroundColor: colors.primaryBlue,
  },
  warning: {
    backgroundColor: colors.secondaryYellow,
  },
  error: {
    backgroundColor: colors.themeRed,
  },
  success: {
    backgroundColor: colors.themeGreen,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
