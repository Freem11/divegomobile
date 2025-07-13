import React, { InputHTMLAttributes, useRef, useState } from 'react';
import ButtonIcon from '../buttonIcon';
import { TextInput } from 'react-native';
import * as S from './styles';
import { colors } from "../../styles";
;

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;
type CustomInputProps = {
  onChangeText:        (text: string) => void;
  error?:              any
  value?:              string
  tooltipEditText?:    string
  tooltipConfirmText?: string
  isEditModeOn:        boolean
  setIsEditModeOn:     React.Dispatch<React.SetStateAction<boolean>>
  isMyShop:            boolean
};


const PlainTextInput = React.forwardRef<TextInput, TextInputProps & CustomInputProps>(function PlainTextInput(props: TextInputProps & CustomInputProps, forwardedRef) {
  const [value, setValue] = useState(props.value);
  const ref = useRef<TextInput>(null);

  return (
    <S.MainContainer>
      <S.StyledTextInput multiline type="hidden" readOnly={!props.isEditModeOn} name={props.name} value={props.value} onChange={props.onChange} ref={forwardedRef} placeholder={!props.isEditModeOn && props.placeholder}/>

      {props.isMyShop && !props.isEditModeOn && (
        <ButtonIcon 
        icon={"pencil"}
        onPress={() => {
          props.setIsEditModeOn(true);
        }}
        size='icon'
        fillColor={colors.neutralGrey}
        />
      )}

      {props.isMyShop && props.isEditModeOn  && (
           <ButtonIcon 
           icon={"check-bold"}
           onPress={() => {
            props.setIsEditModeOn(false);
          }}
           size='icon'
           fillColor="green"
           />
      )}
    </S.MainContainer>
  );
});

export default PlainTextInput;
