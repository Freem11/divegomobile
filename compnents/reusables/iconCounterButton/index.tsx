import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import * as S from './styles';
import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

type StandardButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type IconCounterButtonProps = {
  onPress?:   () => void
  icon?:      React.ReactNode
  disabled?:  boolean
  count: string
  size: string
  fillColor?: string
};

export default function IconCounterButton(props: IconCounterButtonProps & StandardButtonProps) {
  const { children, icon, count, fillColor, ...rest } = props;
  return (
    <S.StyledTouchableHighlight {...rest} underlayColor={colors.buttonPressOverlay} onPress={() => props.onPress()}>
      <S.StyledButton disabled={props.disabled} onPress={props.onPress} {...rest}>
        <S.IconWrapper>
          <Icon name={icon as IconName} fill={fillColor? fillColor : colors.themeWhite}/>
        </S.IconWrapper>
       <S.CounterText>{count}</S.CounterText>
      </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
