import React, { InputHTMLAttributes, useRef, useState } from 'react';
import ButtonIcon from '../buttonIcon';
import { TextInput } from 'react-native';
import * as S from './styles';
import { colors } from "../../styles";
;

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;
type CustomInputProps = {
  onSave:              (value: string) => void
  error?:              any
  value?:              string
  tooltipEditText?:    string
  tooltipConfirmText?: string
};

const PlainTextInput = React.forwardRef<TextInput, TextInputProps & CustomInputProps>(function PlainTextInput(props: TextInputProps & CustomInputProps, forwardedRef) {
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [value, setValue] = useState(props.value);
  const ref = useRef<TextInput>(null);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  // const determineTooltipEdit = () => {
  //   if (props.tooltipConfirmText) {
  //     return (
  //         <Icon name="pencil" fill="darkgrey" />
  //     );
  //   } else {
  //     return (
  //       <Icon name="pencil" fill="darkgrey" />
  //     );
  //   }
  // };

  // const determineTooltipConfirm = () => {
  //   if (props.tooltipConfirmText) {
  //     return (
  //         <Icon name="check-bold" fill="green" />
  //     );
  //   } else {
  //     return (
  //       <Icon name="check-bold" fill="green" />
  //     );
  //   }
  // };

  return (
    <S.MainContainer>
      <S.StyledTextInput type="hidden" name={props.name} value={value} onChange={props.onChange} ref={forwardedRef} />

      <S.StyledTextArea
        ref={ref}
        onKeyDown={onKeyDown}
        suppressContentEditableWarning={true}
        className="ssrc-plain-text-input__textarea"
        contentEditable={!props.readOnly && isEditModeOn}
        onInput={function (e) {
          setValue(e.currentTarget.innerHTML);
        }}
      >
        {props.value || (!isEditModeOn && props.placeholder)}
      </S.StyledTextArea>

      {!props.readOnly && isEditModeOn && (
        <ButtonIcon 
        icon={"pencil"}
        onPress={() => {
          setIsEditModeOn(false);
          props.onSave(`${value}`);
        }}
        size='icon'
        fillColor={colors.neutralGrey}
        />
      )}

      {!props.readOnly && !isEditModeOn && (
           <ButtonIcon 
           icon={"check-bold"}
           onPress={() => {
            setIsEditModeOn(true);
            setTimeout(function () {
              ref.current?.focus();
            }, 0);
          }}
           size='icon'
           fillColor="green"
           />
      )}
    </S.MainContainer>
  );
});

export default PlainTextInput;
