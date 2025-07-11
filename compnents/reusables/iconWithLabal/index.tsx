import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

import * as S from "./styles";

export type IconWithLabelProps = {
  buttonAction: () => void
  label: string
  iconName: string
  fillColor?: string
  bgColor?: string
};

export default function IconWithLabel({ iconName, buttonAction, label, fillColor, ...rest}: IconWithLabelProps) {
 
  return (
    <S.StyledTouchableHighlight onPress={buttonAction} underlayColor={colors.buttonPressOverlay}>
      <S.StyledHousing>
        <S.StyledLabelText {...rest} >{label}</S.StyledLabelText>
        <S.IconWrapper {...rest}>
          <Icon name={iconName as IconName} fill={fillColor === "white" ?colors.themeWhite : colors.neutralGrey}/>
        </S.IconWrapper>
      </S.StyledHousing>
    </S.StyledTouchableHighlight>
  );
}
