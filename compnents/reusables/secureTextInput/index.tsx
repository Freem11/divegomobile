import React, { ForwardedRef, useRef } from "react";
import { TextInput, TextInputProps as RNTextInputProps } from "react-native";

import { colors } from "../../styles";
import Icon from "../../../icons/Icon";

import * as S from "./styles";

type SecureTextInputProps = RNTextInputProps & {
  secure?: boolean
  onChangeText: (text: string) => void;
  error?: any;
};

const SecureTextInput = React.forwardRef<TextInput, SecureTextInputProps>(function SecureTextInput(
  { onChangeText, error, ...rest }: SecureTextInputProps, ref: ForwardedRef<TextInput>) {
  const [secure, setSecure] = React.useState<boolean>(true);

  const onClick = () => {
    setSecure(prev => !prev);
    // ref.current?.focus();
    // setTimeout(() => {
    //   ref.current?.setSelection(ref.current.value.length, ref.current.value.length);
    // }, 0);
  };

  return (
    <S.TextInputWrapper>
      <S.IconWrapperLeft>
        <Icon name={"lock-outline"} fill={colors.neutralGrey}/>
      </S.IconWrapperLeft>

      <S.StyledTextInput
        secureTextEntry={secure}
        ref={ref} 
        onChangeText={onChangeText} // remove once react-hook-form takes over
        placeholderTextColor={colors.neutralGrey}
        {...rest}
      />
      <S.IconWrapperRight onPress={() => onClick()}>
        {secure ? <Icon name={"eye-off"} fill={colors.neutralGrey} onPress={() => onClick()}/>: <Icon name={"eye"} fill={colors.neutralGrey} onPress={() => onClick()}/>}
      </S.IconWrapperRight>
    </S.TextInputWrapper>
  );
});

export default SecureTextInput;
