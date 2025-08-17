import React from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Controller, useForm } from "react-hook-form";

import SecureTextInput from "../../reusables/secureTextInput";
import MobileTextInput from "../../reusables/textInput";
import ButtonIcon from "../../reusables/buttonIcon";
import Button from "../../reusables/button";
import { colors } from "../../styles";

import * as S from "./styles";
import { Form, FormRules } from "./form";

interface FormVals {
  email: string;
  password: string;
}

interface IProps {
  formVals: FormVals;
  secureTextEntry: boolean;
  loginFail: string | null;
  setFormVals: (vals: FormVals) => void;
  setSecureTextEntry: (val: boolean) => void;
  moveToLandingPage: () => void;
  moveToForgotPasswordPage: () => void;
  moveToSignUpPage: () => void;
  onSubmit: (data: Form) => void;
}

export default function LoginPageView(props: IProps) {

  const { t } = useTranslation();

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
  const { control, handleSubmit, formState: { isSubmitting, errors }, getValues, reset } = useForm<Form>({});

  return (
    <S.Container>

      <AnimatedSafeAreaView style={[S.styles.safeArea]}>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={props.moveToLandingPage}
            size="small"
            fillColor={colors.neutralGrey}
          />

        </S.BackButtonWrapper>
      </AnimatedSafeAreaView>

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

        {errors ? <S.ErrorText>{props.loginFail}</S.ErrorText> : <S.ErrorText />}

        <S.ButtonBox>
          <Button
            onPress={handleSubmit(props.onSubmit)}
            alt={false}
            size="medium"
            title={t("Common.login")}
            iconRight="chevron-right"
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
