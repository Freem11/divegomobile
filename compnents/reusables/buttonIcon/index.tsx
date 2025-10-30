import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

import * as S from "./styles";

type StandardButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type ButtonIconProps = {
  onPress?:   () => void
  icon?:      React.ReactNode
  disabled?:  boolean
  title?: string
  size: string
  fillColor?: string
};

export default function ButtonIcon(props: ButtonIconProps & StandardButtonProps) {
  const { children, icon, title, fillColor, ...rest } = props;
  return (
    <S.StyledTouchableHighlight {...rest} underlayColor={colors.buttonPressOverlay} onPress={() => props.onPress()}>
      <S.StyledButton disabled={props.disabled} onPress={props.onPress} {...rest}>
        <S.IconWrapper>
          <Icon name={icon as IconName} fill={fillColor? fillColor : colors.themeWhite}/>
        </S.IconWrapper>
        {title && <S.StyledButtonText>{title}</S.StyledButtonText>}
      </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
