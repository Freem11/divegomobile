import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TextInputField from "../textInput";
import * as S from "./styles";

interface IProps {
  title: string;
  emailPlaceholder: string;
  buttonText: string;
  formVals: { email: string };
  isEnabled: boolean;
  emailSent: string | null;
  setFormVals: (vals: { email: string }) => void;
  moveToLoginPage: () => void;
  passwordRecovery: (email: string) => void;
}

export default function ForgotPageView({
  title,
  formVals,
  isEnabled,
  emailSent,
  buttonText,
  emailPlaceholder,
  setFormVals,
  moveToLoginPage,
  passwordRecovery,
}: IProps) {
  return (
    <S.Container>
      <MaterialIcons
        name="chevron-left"
        size={48}
        color={"darkgrey"}
        onPress={moveToLoginPage}
      />
      <S.Content>
        <S.Header>{title}</S.Header>

        <TextInputField
          icon={"alternate-email"}
          placeHolderText={emailPlaceholder}
          secure={false}
          onChangeText={(text: string) => setFormVals({ email: text })}
          style={{ marginTop: 60 }}
        />

        {emailSent ? <S.ErrorText>{emailSent}</S.ErrorText> : <S.ErrorText />}

        <S.ButtonBox>
          <TouchableWithoutFeedback
            onPress={isEnabled ? () => passwordRecovery(formVals.email) : () => { }}
          >
            <S.LoginButton>
              <S.LoginText>{buttonText}</S.LoginText>
              <MaterialIcons name="chevron-right" size={30} color="#fff" />
            </S.LoginButton>
          </TouchableWithoutFeedback>
        </S.ButtonBox>
      </S.Content>
    </S.Container>
  );
}
