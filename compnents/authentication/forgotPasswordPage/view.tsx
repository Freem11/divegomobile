import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TextInputField from "../utils/textInput";
import * as S from "./styles";
import { useTranslation } from "react-i18next";

interface IProps {
  formVals: { email: string };
  isEnabled: boolean;
  emailSent: string | null;
  setFormVals: (vals: { email: string }) => void;
  moveToLoginPage: () => void;
  passwordRecovery: (email: string) => void;
}

export default function ForgotPageView({
  formVals,
  isEnabled,
  emailSent,
  setFormVals,
  moveToLoginPage,
  passwordRecovery,
}: IProps) {
  const { t } = useTranslation();

  return (
    <S.Container>
      <MaterialIcons
        name="chevron-left"
        size={48}
        color={"darkgrey"}
        onPress={moveToLoginPage}
      />

      <S.Content>
        <S.Header>{t("forgot.title")}</S.Header>

        <TextInputField
          icon={"alternate-email"}
          placeHolderText={t("forgot.email")}
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
              <S.LoginText>{t("forgot.button")}</S.LoginText>
              <MaterialIcons name="chevron-right" size={30} color="#fff" />
            </S.LoginButton>
          </TouchableWithoutFeedback>
        </S.ButtonBox>
      </S.Content>
    </S.Container>
  );
}
