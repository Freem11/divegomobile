import React from "react";
import { TouchableHighlightProps } from "react-native";

import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

import * as S from "./styles";

export type ButtonIconProps = {
  icon?: React.ReactNode;
  disabled?: boolean;
  fillColor?: string;
  size?: number;
} & TouchableHighlightProps;

export default function ButtonIcon(props: ButtonIconProps) {
  const { icon, fillColor, size, onPress, disabled, ...rest } = props;
  
  return (
    <S.StyledTouchableHighlight
      disabled={disabled} 
      underlayColor={colors.buttonPressOverlay}
      onPress={onPress}
      {...rest}
    >
      <S.IconWrapper>
        <Icon
          name={icon as IconName}
          style={{ height: size, width: size }}
          fill={fillColor ? fillColor : "rgba(255,255,255,0.8)"}
        />
      </S.IconWrapper>
    </S.StyledTouchableHighlight>
  );
}
