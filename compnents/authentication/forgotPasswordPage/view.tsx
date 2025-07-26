import React from "react";
import * as S from "./styles";
import { useTranslation } from "react-i18next";
import MobileTextInput from "../../reusables/textInput";
import ButtonIcon from "../../reusables/buttonIcon";
import Button from "../../reusables/button";
import { colors } from "../../styles";

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
      <S.BackButtonWrapper>
        <ButtonIcon
          icon="chevron-left"
          onPress={moveToLoginPage}
          size="small"
          fillColor={colors.neutralGrey}
        />
      </S.BackButtonWrapper>

      <S.Content>
        <S.Header>{t("Auth.resetPassword")}</S.Header>

        <S.TopInputWrapper>
          <MobileTextInput
            iconLeft="at"
            placeholder={t("Auth.enterAccountEmail")}
            value={formVals.email}
            onChangeText={(text: string) =>
              setFormVals({ ...formVals, email: text })
            }
          />
        </S.TopInputWrapper>

        {emailSent ? <S.ErrorText>{emailSent}</S.ErrorText> : <S.ErrorText />}

        <S.ButtonBox>
          <Button
            onPress={
              isEnabled ? () => passwordRecovery(formVals.email) : () => {}
            }
            alt={false}
            size="medium"
            title={t("Auth.sendRecoverEmail")}
            iconRight="chevron-right"
          />
        </S.ButtonBox>
      </S.Content>
    </S.Container>
  );
}
