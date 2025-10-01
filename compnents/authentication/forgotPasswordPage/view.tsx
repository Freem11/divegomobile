import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";
import { Controller, FieldErrors, useForm } from "react-hook-form";

import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import { colors } from "../../styles";
import { showWarning } from "../../toast";

import * as S from "./styles";
import { Form, FormRules } from "./form";

interface IProps {
  defaultFormValues: Form;
  moveToLoginPage: () => void;
  onSubmit: (data: Form) => void;
}

export default function ForgotPageView(props: IProps) {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(true);

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({
    defaultValues: props.defaultFormValues
  });

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
        <S.Header>{t("Auth.resetPassword")}</S.Header>

        <Controller
          control={control}
          name="Email"
          rules={FormRules.Email}
          render={({ field: { onChange } }) => (
            <S.TopInputWrapper>
              <MobileTextInput
                error={errors.Email}
                iconLeft="at"
                placeholder={t("Auth.enterAccountEmail")}
                onChangeText={onChange}
              />
            </S.TopInputWrapper>
          )}
        />

        <S.ErrorText />

        <S.ButtonBox>
          <Button
            onPress={() => {
              setIsEnabled(false);
              return handleSubmit(props.onSubmit, handleError);
            }}
            alt={false}
            size="medium"
            title={t("Auth.sendRecoverEmail")}
            iconRight="chevron-right"
            disabled={!isEnabled || isSubmitting}
          />
        </S.ButtonBox>
      </S.Content>
    </S.Container>
  );
}
