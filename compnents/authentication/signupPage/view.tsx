import React from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Controller, FieldErrors, useForm } from "react-hook-form";

import SecureTextInput from "../../reusables/secureTextInput";
import MobileTextInput from "../../reusables/textInput";
import ButtonIcon from "../../reusables/buttonIcon";
import Button from "../../reusables/button";
import { colors } from "../../styles";
import { showWarning } from "../../toast";

import * as S from "./styles";
import { Form, FormRules } from "./form";

interface IProps {
  moveToLandingPage: () => void;
  moveToLoginPage: () => void;
  onSubmit: (data: Form) => void;
}

export default function CreateAccountPageView(props: IProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({});

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

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
        <S.Header>{t("Common.signup")}</S.Header>

        <Controller
          control={control}
          name="Name"
          rules={FormRules.Name}
          render={({ field: { onChange } }) => (
            <S.TopInputWrapper>
              <MobileTextInput
                error={errors.Name}
                iconLeft="person"
                placeholder={t("Common.fullName")}
                onChangeText={onChange}
              />
            </S.TopInputWrapper>
          )}
        />

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
          rules={FormRules.Password}
          render={({ field: { onChange } }) => (
            <S.TextInputWrapper>
              <SecureTextInput
                onChangeText={onChange}
                placeholder={t("Common.password")}
              />
            </S.TextInputWrapper>
          )}
        />

        <S.ButtonBox>
          <Button
            onPress={handleSubmit(props.onSubmit, handleError)}
            alt={false}
            size="medium"
            title={t("Common.signup")}
            iconRight="chevron-right"
            disabled={isSubmitting}
          />
        </S.ButtonBox>

      </S.Content>

      <S.PromptBox>
        <S.PromptText>{t("Auth.alreadyHaveAccount")}</S.PromptText>
        <TouchableWithoutFeedback onPress={props.moveToLoginPage}>
          <S.PromptLinkText>{t("Common.login")}</S.PromptLinkText>
        </TouchableWithoutFeedback>
      </S.PromptBox>
    </S.Container>
  );
}
