import React from "react";
import { useTranslation } from "react-i18next";
import { Controller, FieldErrors, useForm } from "react-hook-form";

import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
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

  const onLocalSubmit = async (data: Form) => {
    await props.onSubmit(data);
    reset();
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<Form>({
    defaultValues: props.defaultFormValues,
  });

  const handleError = (errors: FieldErrors<Form>) => {
    console.log("Validation Errors:", errors);
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
          render={({ field: { onChange, value } }) => (
            <S.TopInputWrapper>
              <MobileTextInput
                error={errors.Email}
                iconLeft="at"
                placeholder={t("Auth.enterAccountEmail")}
                onChangeText={onChange}
                value={value}
              />
            </S.TopInputWrapper>
          )}
        />

        <S.ErrorText />

        <S.ButtonBox>
          <Button
            onPress={handleSubmit(onLocalSubmit, handleError)}
            alt={false}
            size="medium"
            iconRight="chevron-right"
            title={t("Auth.sendRecoverEmail")}
            disabled={isSubmitting}
          />
        </S.ButtonBox>
      </S.Content>
    </S.Container>
  );
}