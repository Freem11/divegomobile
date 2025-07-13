import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import * as S from './styles';
import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

type StandardButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type ButtonProps = {
  onPress?:   () => void
  iconLeft?:  React.ReactNode
  iconRight?: React.ReactNode
  alt?: boolean
  size: string
  children?:  React.ReactNode
};

export default function Button(props: ButtonProps & StandardButtonProps) {
  const { iconLeft, iconRight, children, ...rest } = props;

  return (
    <S.StyledTouchableHighlight underlayColor={colors.buttonPressOverlay} {...rest} onPress={() => props.onPress()}>
    <S.StyledButton {...rest}>
      {iconLeft && 
        <S.IconWrapperLeft>
          <Icon name={iconLeft as IconName} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
        </S.IconWrapperLeft>
      }

        <S.StyledButtonText alt={props.alt}>
          {props.title}
        </S.StyledButtonText>

        {iconRight && 
          <S.IconWrapperRight>
            <Icon name={iconRight as IconName} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperRight>}
    </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
