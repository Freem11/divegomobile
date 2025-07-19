import React from "react";
import { moderateScale } from "react-native-size-matters";

import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

import * as S from "./styles";

type GhostButtonProps = {
  onPress: () => void
  title: string
  iconRight?: IconName
};

export default function GhostButton({
  onPress,
  title,
  iconRight = "chevron-right"
}: GhostButtonProps) {
  return (
    <S.GhostButton onPress={onPress}>
      <S.GhostButtonText>
        {title}
      </S.GhostButtonText>
      <Icon
        name={iconRight}
        style={{ top: moderateScale(2)}}
        width={moderateScale(26)}
        height={moderateScale(26)}
        fill={colors.primaryBlue}
      />
    </S.GhostButton>
  );
}