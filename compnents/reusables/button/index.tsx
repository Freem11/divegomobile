import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import Icon, { IconName } from "../../../icons/Icon";
import { buttonSizes, colors } from "../../styles";

import * as S from "./styles";

type StandardButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type ButtonProps = {
  onPress?:   () => void
  iconLeft?:  IconName
  iconRight?: IconName
  alt?: boolean
  size: keyof typeof buttonSizes
  title?: string
  round?: boolean
};

export default function Button(props: ButtonProps & StandardButtonProps) {
  const { iconLeft, iconRight, round = true, ...rest } = props;

  return (
    <S.StyledTouchableHighlight underlayColor={colors.buttonPressOverlay} {...rest} onPress={() => props.onPress()}>
      <S.StyledButton round={round} {...rest}>
        {iconLeft && (
          <S.IconWrapperLeft size={props.size}>
            <Icon name={iconLeft} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperLeft>
        )}

        <S.StyledButtonText alt={props.alt} size={props.size}>
          {props.title}
        </S.StyledButtonText>

        {iconRight && (
          <S.IconWrapperRight size={props.size}>
            <Icon name={iconRight} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperRight>
        )}
      </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
