import { moderateScale } from "react-native-size-matters";
import React, { FC } from "react";

import Icon, { IconName } from "../../../../icons/Icon";
import { colors } from "../../../styles";
import { Form } from "../tripCreator/form";

import * as S from "./styles";

interface FeatureButtonProps {
  title: string,
  onPress?: () => void;
  formValues?: Required<Form>
  iconName: IconName
}

export const FeatureButton: FC<FeatureButtonProps> = ({ title, onPress, formValues, iconName }) => {

  return (
    <S.FeatureButton
      onPress={onPress}
    >
      <Icon
        name={iconName}
        color={colors.borderActive}
        width={moderateScale(32)}
        height={moderateScale(32)}
      />
      <S.Label>{title}</S.Label>
    </S.FeatureButton>
  );
};
