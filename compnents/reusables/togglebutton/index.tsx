import React, { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";

import Icon, { IconName } from "../../../icons/Icon";
import { buttonSizes, colors } from "../../styles";

import * as S from "./styles";

type ToggleButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type ButtonProps = {
  onPress?:   () => void
  iconLeft?:  IconName
  iconRight?: IconName
  alt?: boolean
  size: keyof typeof buttonSizes
  title?: string
  round?: boolean
};

export default function ToggleButton(props: ButtonProps & ToggleButtonProps) {
  const { iconLeft, iconRight, round = true, ...rest } = props;

  const [isActive, setisActive] = useState(props.alt);

  const handleOnPress = () => {
    setisActive(!isActive);
    props.onPress();
  };

  return (
    <S.StyledTouchableHighlight underlayColor={colors.buttonPressOverlay} {...rest} onPress={() => handleOnPress()}>
      <S.StyledButton round={round} {...rest} alt={isActive}>
        {iconLeft && (
          <S.IconWrapperLeft size={props.size}>
            <Icon name={iconLeft} fill={isActive ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperLeft>
        )}

        <S.StyledButtonText alt={isActive} size={props.size}>
          {props.title}
        </S.StyledButtonText>

        {iconRight && (
          <S.IconWrapperRight size={props.size}>
            <Icon name={iconRight} fill={isActive ? colors.primaryBlue : colors.themeWhite}/>
          </S.IconWrapperRight>
        )}
      </S.StyledButton>
    </S.StyledTouchableHighlight>
  );
}
