import { TouchableOpacity } from "react-native";
import React, { FC } from "react";

import Icon, { IconName } from "../../icons/Icon";

import { styles } from "./styles";

interface BackButtonProps {
  iconName: IconName
  onPress: () => void
}

export const NavigationButton: FC<BackButtonProps> = ({ iconName, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.navigationButton}
    >
      <Icon
        name={iconName}
        color="#000"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};