import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Controller, FieldErrors, useForm } from "react-hook-form";

import SecureTextInput from "../../reusables/secureTextInput";
import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import { colors } from "../../styles";
import { showWarning } from "../../toast";

import * as S from "./styles";
import { Form, FormRules } from "./form";

interface IProps {
  moveToLandingPage: () => void;
  moveToForgotPasswordPage: () => void;
  moveToSignUpPage: () => void;
  onSubmit: (data: Form) => void;
}

export default function LoginPageView(props: IProps) {

  const { t } = useTranslation();

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({});

  const handleError = (errors: FieldErrors<Form>) => {
    console.log({ errors });
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        showWarning(error.message);
      }
    });
  };

  return (
    <S.Container>
      <S.Content>
        <S.Header>{t("Common.login")}</S.Header>

        <Controller
          control={control}
          name="Email"
          rules={FormRules.Email}
          render={({ field: { onChange } }) => (
            <S.TextInputWrapper>
              <MobileTextInput
                error={errors.Email}
                iconLeft="at"
                placeholder={t("Common.email")}
                onChangeText={onChange}
              />
            </S.TextInputWrapper>
          )}
        />

        <Controller
          control={control}
          name="Password"
          rules={FormRules.Email}
          render={({ field: { onChange } }) => (
            <S.SecureTextInputWrapper>
              <SecureTextInput
                onChangeText={onChange}
                placeholder={t("Common.password")}
              />
            </S.SecureTextInputWrapper>
          )}
        />

        <S.ErrorText />

        <S.ButtonBox>
          <Button
            onPress={handleSubmit(props.onSubmit, handleError)}
            alt={false}
            size="medium"
            title={t("Common.login")}
            iconRight="chevron-right"
            disabled={isSubmitting}
          />
        </S.ButtonBox>
      </S.Content>

      <S.ForgotBox>
        <TouchableWithoutFeedback onPress={props.moveToForgotPasswordPage}>
          <S.PromptLinkText>{t("Auth.forgotPassword")}</S.PromptLinkText>
        </TouchableWithoutFeedback>
      </S.ForgotBox>

      <S.PromptBox>
        <S.PromptText>{t("Auth.noAccount")}</S.PromptText>
        <TouchableWithoutFeedback onPress={props.moveToSignUpPage}>
          <S.PromptLinkText>{t("Common.signup")}</S.PromptLinkText>
        </TouchableWithoutFeedback>
      </S.PromptBox>
    </S.Container>
  );
}
