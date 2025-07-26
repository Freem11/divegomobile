import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";

import SecureTextInput from "../../reusables/secureTextInput";
import MobileTextInput from "../../reusables/textInput";
import ButtonIcon from "../../reusables/buttonIcon";
import Button from "../../reusables/button";
import { colors } from "../../styles";

import * as S from "./styles";

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

  return (
    <S.Container>
      <S.BackButtonWrapper>
        <ButtonIcon
          icon="chevron-left"
          onPress={moveToLandingPage}
          size="small"
          fillColor={colors.neutralGrey}
        />
      </S.BackButtonWrapper>

      <S.Content>
        <S.Header>{t("Common.signup")}</S.Header>

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
    </S.Container>
  );
}
