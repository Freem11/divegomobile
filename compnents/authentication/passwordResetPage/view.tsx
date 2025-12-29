import React from "react";
import { useTranslation } from "react-i18next";
import { Controller, FieldErrors, useForm } from "react-hook-form";

import Button from "../../reusables/button";
import { showWarning } from "../../toast";
import SecureTextInput from "../../reusables/secureTextInput";

import * as S from "./styles";
import { Form, FormRules } from "./form";

interface IProps {
  defaultFormValues: Form;
  moveToLoginPage: () => void;
  onSubmit: (data: Form) => void;
}

export default function ResetPageView(props: IProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
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
        <S.Header>{t("Auth.newPassword")}</S.Header>

        <Controller
          control={control}
          name="NewPass"
          rules={FormRules.NewPass}
          render={({ field: { onChange, value } }) => (
            <S.SecureTextInputWrapper>
              <SecureTextInput
                onChangeText={onChange}
                value={value}
                placeholder={t("Auth.newPasswordPlaceholder")}
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
            title={t("Auth.newPassword")}
            iconRight="chevron-right"
            disabled={isSubmitting}
          />
        </S.ButtonBox>
      </S.Content>
    </S.Container>
  );
}