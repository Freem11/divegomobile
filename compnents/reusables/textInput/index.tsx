import React, { ForwardedRef } from 'react';
import { TextInput, TextInputProps as RNTextInputProps, TouchableOpacity } from 'react-native';
import { FieldError } from 'react-hook-form';

import Icon, { IconName } from "../../../icons/Icon";
import { colors } from '../../styles';

import * as S from './styles';

export type TextInputProps = {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  handleClear?: () => void;
  filterValue?: string;
  error?: FieldError;
} & RNTextInputProps;

const MobileTextInput = React.forwardRef<TextInput, TextInputProps>(function MobileTextInput(
  { iconLeft, iconRight, error, onChangeText, handleClear, filterValue, ...rest }: TextInputProps,
  ref: ForwardedRef<TextInput>
) {

  return (
    <S.Container>
      <S.TextInputWrapper hasError={!!error}>
        {iconLeft && 
          <S.IconWrapperLeft>
            <Icon name={iconLeft as IconName} fill={error ? colors.red : colors.primaryBlue}/>
          </S.IconWrapperLeft>
        }
        <S.StyledTextInput 
          ref={ref} 
          onChangeText={onChangeText}
          placeholderTextColor={colors.neutralGrey}
          value={filterValue}
          {...rest} 
        />
        {iconRight && handleClear && filterValue?.length > 0 &&
          <TouchableOpacity onPress={() => handleClear()}>
            <S.IconWrapperRightClear>
              <Icon name={iconRight as IconName} fill={colors.neutralGrey}/>
            </S.IconWrapperRightClear>
          </TouchableOpacity>
        }
        {iconRight && !handleClear &&
            <S.IconWrapperRight>
              <Icon name={iconRight as IconName} fill={error ? colors.red : colors.primaryBlue}/>
            </S.IconWrapperRight>
        }
      </S.TextInputWrapper>
      {error && (
        <S.ErrorText>{error.message}</S.ErrorText>
      )}
    </S.Container>
  );
});

export default MobileTextInput;
