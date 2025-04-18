import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import * as S from './styles';
import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

export type IconWithLabelProps = {
    buttonAction: () => void
    label: string
    iconName: string
};

export default function IconWithLabel(props: IconWithLabelProps) {
  return (
    <S.StyledTouchableHighlight onPress={props.buttonAction} underlayColor={colors.buttonPressOverlay}>
    <S.StyledHousing>
      <S.StyledLabelText>{props.label}</S.StyledLabelText>
      <S.IconWrapper>
      <Icon name={props.iconName as IconName} fill={colors.neutralGrey}/>
      </S.IconWrapper>
    </S.StyledHousing>
    </S.StyledTouchableHighlight>
  );
}
