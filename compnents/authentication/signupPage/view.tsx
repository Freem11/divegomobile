import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";

import SecureTextInput from "../../reusables/secureTextInput";
import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";

import * as S from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FormVals {
  name: string;
  email: string;
  password: string;
}

interface IProps {
  formVals: FormVals;
  secureTextEntry: boolean;
  regFail: string | null;
  setFormVals: (vals: FormVals) => void;
  setSecureTextEntry: (val: boolean) => void;
  moveToLandingPage: () => void;
  moveToLoginPage: () => void;
  handleSignUp: () => void;
}

export default function CreateAccountPageView({
  formVals,
  regFail,
  setFormVals,
  handleSignUp,
  moveToLandingPage,
  moveToLoginPage,
}: IProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <S.Container>
      <S.HeaderContainer>
        <S.Header>{t("Common.registerNow")}</S.Header>
      </S.HeaderContainer>
      <S.ContentContainer paddingBottom={insets.bottom + 16}>
        <S.Content>
          <S.TopInputWrapper>
            <MobileTextInput
              iconLeft="person"
              placeholder={t("Common.fullName")}
              value={formVals.name}
              onChangeText={(text: string) =>
                setFormVals({ ...formVals, name: text })
              }
            />
          </S.TopInputWrapper>

          <S.TextInputWrapper>
            <MobileTextInput
              iconLeft="at"
              placeholder={t("Common.email")}
              value={formVals.email}
              onChangeText={(text: string) =>
                setFormVals({ ...formVals, email: text })
              }
            />
          </S.TextInputWrapper>

          <S.TextInputWrapper>
            <SecureTextInput
              onChangeText={(text: string) =>
                setFormVals({ ...formVals, password: text })
              }
              placeholder={t("Common.password")}
            />
          </S.TextInputWrapper>

          {regFail ? <S.ErrorText>{regFail}</S.ErrorText> : <S.ErrorText />}

          <S.ButtonBox>
            <Button
              onPress={handleSignUp}
              alt={false}
              size="medium"
              title={t("Common.signup")}
              iconRight="chevron-right"
            />
          </S.ButtonBox>
        </S.Content>

        <S.PromptBox>
          <S.PromptText>{t("Auth.alreadyHaveAccount")}</S.PromptText>
          <TouchableWithoutFeedback onPress={moveToLoginPage}>
            <S.PromptLinkText>{t("Common.login")}</S.PromptLinkText>
          </TouchableWithoutFeedback>
        </S.PromptBox>
      </S.ContentContainer>
    </S.Container>
  );
}
