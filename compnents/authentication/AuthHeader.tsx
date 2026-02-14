import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

import { buttonSizes, colors } from "../styles";
import ButtonIcon from "../reusables/buttonIcon";

/**
 * A custom header for Auth flow as the default header on iOS will partially truncate
 * our scalable back button icon {@link ButtonIcon}.
 * @returns
 */
function AuthHeader() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Give extra height to make sure the back arrow always fits.
  const headerHeight = moderateScale(buttonSizes.small.height * 2);

  return (
    <View style={[styles.container, { height: headerHeight, paddingTop: insets.top }]}>
      <ButtonIcon
        icon="chevron-left"
        onPress={navigation.goBack}
        size="small"
        fillColor={colors.neutralGrey}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    borderBottomWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingStart: "3%"
  },
});

export default AuthHeader;
