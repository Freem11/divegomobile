import React, { ForwardedRef } from 'react';
import { TextInput, TextInputProps as RNTextInputProps, TouchableOpacity } from 'react-native';
import * as S from './styles';
import Icon, { IconName } from "../../../icons/Icon";
import { colors } from '../../styles';
import { UseFormRegisterReturn } from "react-hook-form";

export type TextInputProps = {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  handleClear?: () => void;
  filterValue?: string;
  error?: any;
} & RNTextInputProps;

const MobileTextInput = React.forwardRef<TextInput, TextInputProps>(function MobileTextInput(
  { iconLeft, iconRight, error, onChangeText, handleClear, filterValue, ...rest }: TextInputProps,
  ref: ForwardedRef<TextInput>
) {

  return (
    <S.TextInputWrapper>
      {iconLeft && 
        <S.IconWrapperLeft>
          <Icon name={iconLeft as IconName} fill={colors.neutralGrey}/>
        </S.IconWrapperLeft>
      }
      <S.StyledTextInput 
        ref={ref} 
        onChangeText={onChangeText}
        placeholderTextColor={colors.neutralGrey}
        value={filterValue}
        {...rest} 
      />
      {iconRight && handleClear && filterValue.length > 0 &&
        <TouchableOpacity onPress={() => handleClear()}>
          <S.IconWrapperRightClear>
            <Icon name={iconRight as IconName} fill={colors.neutralGrey}/>
          </S.IconWrapperRightClear>
        </TouchableOpacity>
      }
      {iconRight && !handleClear &&
          <S.IconWrapperRight>
            <Icon name={iconRight as IconName} fill={colors.neutralGrey}/>
          </S.IconWrapperRight>
      }
    </S.TextInputWrapper>
  );
});

export default MobileTextInput;
