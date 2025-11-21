import React, { } from "react";
import { Control, Controller, FieldErrors, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Form, FormRules } from "../form";
import * as S from "../../styles";
import { colors } from "../../../../styles";

interface Step2Props {
  control: Control<Form, any, Form>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
}

export const Step2: React.FC<Step2Props> = ({
  control,
  watch,
  errors
}) => {
  const { t } = useTranslation();

  return (
    <S.InputGroupContainer>
      <S.Title>{t("DiveSiteReviewer.step2Title")}</S.Title>
      <S.Subtitle>{t("DiveSiteReviewer.step2Description")}</S.Subtitle>

      <S.DescriptionBox>
        <Controller
          control={control}
          name="Details"
          rules={FormRules.Details}
          render={({ field: { onChange, value } }) => (
            <S.MultilineTextInput
              multiline
              error={errors.Details}
              placeholder={t("TripCreator.tripDescriptionPlaceholder").replace(/\\n/g, "\n")}
              placeholderTextColor={colors.neutralGrey}
              onChangeText={onChange}
              value={value}
            >
            </S.MultilineTextInput>
          )}
        />
      </S.DescriptionBox>

    </S.InputGroupContainer>
  );
};
