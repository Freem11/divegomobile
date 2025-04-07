import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import * as S from './styles';
import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

type StandardButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type ButtonProps = {
  onPress?:   () => void
  icon?:      React.ReactNode
  disabled?:  boolean
  title?: string
  size: string
};

export default function ButtonIcon(props: ButtonProps & StandardButtonProps) {
  const { children, icon, title, ...rest } = props;
  return (
    <S.StyledTouchableHighlight {...rest} underlayColor={colors.buttonPressOverlay} onPress={() => props.onPress()}>
      <S.StyledButton disabled={props.disabled} onPress={props.onPress} {...rest}>
        <S.IconWrapper>
          <Icon name={icon as IconName} fill={colors.themeWhite}/>
        </S.IconWrapper>
       {title && <S.StyledButtonText>{title}</S.StyledButtonText>} 
      </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
