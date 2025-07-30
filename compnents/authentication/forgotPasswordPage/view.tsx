import React from "react";
import * as S from "./styles";
import { useTranslation } from "react-i18next";
import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  passwordRecovery,
}: IProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <S.Container>
      <S.HeaderContainer>
        <S.Header>{t("Common.forgotPassword")}</S.Header>
      </S.HeaderContainer>
      <S.ContentContainer paddingBottom={insets.bottom + 16}>
        <S.Content>
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
      </S.ContentContainer>
    </S.Container>
  );
}
