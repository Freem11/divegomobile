import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import * as S from './styles';
import Icon, { IconName } from "../../../icons/Icon";
import { buttonSizes, colors } from "../../styles";

type StandardButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type ButtonProps = {
  onPress?:   () => void
  iconLeft?:  IconName
  iconRight?: IconName
  alt?: boolean
  size: keyof typeof buttonSizes
  children?:  React.ReactNode
  title?: string
  round?: boolean
};

export default function Button(props: ButtonProps & StandardButtonProps) {
  const { iconLeft, iconRight, children, round = true, ...rest } = props;

  return (
    <S.StyledTouchableHighlight underlayColor={colors.buttonPressOverlay} {...rest} onPress={() => props.onPress()}>
    <S.StyledButton round={round} {...rest}>
      {iconLeft && 
        <S.IconWrapperLeft>
          <Icon name={iconLeft} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
        </S.IconWrapperLeft>
      }

        <S.StyledButtonText alt={props.alt} size={props.size}>
          {props.title}
        </S.StyledButtonText>

        {iconRight && 
          <S.IconWrapperRight>
            <Icon name={iconRight} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperRight>}
    </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
