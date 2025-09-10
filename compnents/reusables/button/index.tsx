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

  const ButtonElement = props.disabled ? S.DisabledButton : S.StyledButton;
  const TextElement = props.disabled ? S.DisabledButtonText : S.StyledButtonText;

  return (
    <S.StyledTouchableHighlight underlayColor={colors.themeWhite} {...rest} onPress={() => props.onPress()}>
      <ButtonElement round={round} {...rest}>
        {iconLeft && (
          <S.IconWrapperLeft size={props.size}>
            <Icon name={iconLeft} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperLeft>
        )}

        <TextElement alt={props.alt} size={props.size}>
          {props.title}
        </TextElement>

        {iconRight && (
          <S.IconWrapperRight size={props.size}>
            <Icon name={iconRight} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperRight>
        )}
      </ButtonElement>
    </S.StyledTouchableHighlight>
  );
}
