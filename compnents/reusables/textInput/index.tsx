import React, { ForwardedRef } from 'react';
import { TextInput, TextInputProps as RNTextInputProps } from 'react-native';
import { TextInputWrapper, StyledTextInput } from './styles';
import { colors } from '../../styles';

export type TextInputProps = {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  keyboardConfig?: string;
  onChangeText: (text: string) => void;
  error?: any;
} & RNTextInputProps;

const MobileTextInput = React.forwardRef<TextInput, TextInputProps>(function MobileTextInput(
  { iconLeft, iconRight, keyboardConfig, onChangeText, error, ...rest }: TextInputProps,
  ref: ForwardedRef<TextInput>
) {
  return (
    <TextInputWrapper>
      {iconLeft && <>{iconLeft}</>}
      <StyledTextInput 
        ref={ref} 
        onChangeText={onChangeText} // remove once react-hook-form takes over
        placeholderTextColor={colors.neutralGrey}
        keyboardType={keyboardConfig}
        {...rest} />
        {iconRight && <>{iconRight}</>}
    </TextInputWrapper>
  );
});

export default MobileTextInput;
