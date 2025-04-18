import React, { ForwardedRef } from 'react';
import { TextInput, TextInputProps as RNTextInputProps } from 'react-native';
import { TextInputWrapper, StyledTextInput, IconWrapperLeft, IconWrapperRight } from './styles';
import { colors } from '../../styles';

export type TextInputProps = {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onChangeText: (text: string) => void;
  error?: any;
} & RNTextInputProps;

const MobileTextInput = React.forwardRef<TextInput, TextInputProps>(function MobileTextInput(
  { iconLeft, iconRight, onChangeText, error, ...rest }: TextInputProps,
  ref: ForwardedRef<TextInput>
) {
  return (
    <TextInputWrapper>
      {iconLeft && <IconWrapperLeft>{iconLeft}</IconWrapperLeft>}
      <StyledTextInput 
        ref={ref} 
        onChangeText={onChangeText} // remove once react-hook-form takes over
        placeholderTextColor={colors.neutralGrey}
        {...rest} 
      />
      {iconRight && <IconWrapperRight>{iconRight}</IconWrapperRight>}
    </TextInputWrapper>
  );
});

export default MobileTextInput;
