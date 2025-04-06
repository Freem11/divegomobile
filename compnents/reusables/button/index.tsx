import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { StyledButton, StyledButtonText, IconWrapperLeft, IconWrapperRight } from './styles';
import Icon, { IconName } from "../../../icons/Icon";
import { colors } from "../../styles";

type StandardButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export type ButtonProps = {
  onPress?:   () => void
  iconLeft?:  React.ReactNode
  iconRight?: React.ReactNode
  alt?: boolean
  children?:  React.ReactNode
};

export default function Button(props: ButtonProps & StandardButtonProps) {
  const { iconLeft, iconRight, children, ...rest } = props;
  return (
    <StyledButton {...rest} onPress={() => props.onPress()}>
      {iconLeft && 
        <IconWrapperLeft>
          <Icon name={iconRight as IconName} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
        </IconWrapperLeft>
      }

        <StyledButtonText alt={props.alt}>
          {props.title}
        </StyledButtonText>

        {iconRight && 
          <IconWrapperRight>
            <Icon name={iconRight as IconName} fill={props.alt ? colors.primaryBlue : colors.themeWhite}/>
          </IconWrapperRight>}
    </StyledButton>
  );
}
