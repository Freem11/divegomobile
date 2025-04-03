import React, { ForwardedRef } from 'react';
import { TextInput, TextInputProps as RNTextInputProps } from 'react-native';  // Use TextInputProps from React Native
import { TextInputWrapper, StyledTextInput } from './styles'; // Adjust path as needed

// import { colors } from '../../styles';   use when we setup the darkgray color as a varaible

export type TextInputProps = {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  error?: any;
} & RNTextInputProps;

const MobileTextInput = React.forwardRef<TextInput, TextInputProps>(function MobileTextInput(
  { iconLeft, iconRight, onChangeText, error, ...rest }: TextInputProps,
  ref: ForwardedRef<TextInput>
) {
  return (
    <TextInputWrapper>
      {iconLeft && <>{iconLeft}</>}
      <StyledTextInput 
        ref={ref} 
        onChangeText={onChangeText} // remove once react-hook-form takes over
        placeholderTextColor={'darkgrey'}
        {...rest} />
        {iconRight && <>{iconRight}</>}
    </TextInputWrapper>
  );
});

export default MobileTextInput;
