import { moderateScale } from "react-native-size-matters";
import React, { FC } from "react";

import Icon, { IconName } from "../../../../icons/Icon";
import { colors } from "../../../styles";
import { Form } from "../tripCreator/form";

import * as S from "./styles";

interface FeatureButtonProps {
  title: string;
  onPress?: () => void;
  formValues?: Required<Form>;
  iconName: IconName;
  disabled?: boolean; // Added disabled prop
}

export const FeatureButton: FC<FeatureButtonProps> = ({
  title,
  onPress,
  iconName,
  disabled
}) => {
  return (
    <S.FeatureButton
      onPress={disabled ? undefined : onPress}
      style={{
        opacity: disabled ? 0.5 : 1,
        backgroundColor: disabled ? colors.backgroundDisabled : colors.lighterBlue
      }}
    >
      <Icon
        name={iconName}
        color={disabled ? colors.lightGrey : colors.primaryBlue}
        width={moderateScale(32)}
        height={moderateScale(32)}
      />
      <S.Label style={{ color: disabled ? colors.darkGrey : colors.primaryBlue }}>
        {title}
      </S.Label>
    </S.FeatureButton>
  );
};