import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import Icon, { IconName } from "../../../icons/Icon";
import { buttonSizes, colors } from "../../styles";

import * as S from "./styles";

type ToggleButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type ButtonProps = {
  onPress?:   () => void
  iconLeft?:  IconName
  iconRight?: IconName
  active: boolean
  size: keyof typeof buttonSizes
  title?: string
  round?: boolean
};

export default function ToggleButton(props: ButtonProps & ToggleButtonProps) {
  const { iconLeft, iconRight, round = true, active, ...rest } = props;

  const handleOnPress = () => {
    props.onPress?.();
  };

  return (
    <S.StyledTouchableHighlight underlayColor={colors.buttonPressOverlay} {...rest} onPress={() => handleOnPress()}>
      <S.StyledButton round={round} {...rest} active={active}>
        {iconLeft && (
          <S.IconWrapperLeft size={props.size}>
            <Icon name={iconLeft} fill={colors.primaryBlue} />
          </S.IconWrapperLeft>
        )}

        <S.TextWrapper>
          <S.StyledButtonText active={active} size={props.size}>
            {props.title}
          </S.StyledButtonText>
        </S.TextWrapper>

        {iconRight && (
          <S.IconWrapperRight size={props.size}>
            <Icon name={iconRight} fill={colors.primaryBlue} />
          </S.IconWrapperRight>
        )}
      </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
