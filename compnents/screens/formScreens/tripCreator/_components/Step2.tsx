import React, { } from "react";
import { Control, Controller, FieldErrors, UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Form, FormRules } from "../form";
import * as S from "../../styles";
import { colors } from "../../../../styles";
import { CloneTripButton } from "../../cloneTripButton";

interface Step2Props {
  control: Control<Form, any, Form>
  editMode: boolean
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
  values: Form
}

export const Step2: React.FC<Step2Props> = ({
  control,
  editMode,
  setEditMode,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <S.InputGroupContainer>
      <S.Title>{t("TripCreator.step2Title")}</S.Title>
      <S.Subtitle>{t("TripCreator.step2Description")}</S.Subtitle>

      <S.TripDetailsBox>
        <Controller
          control={control}
          name="Details"
          rules={FormRules.Details}
          render={({ field: { onChange, value } }) => (
            <S.MultilineTextInput
              multiline
              error={errors.Details}
              placeholder={t("TripCreator.tripDescriptionPlaceholder")}
              placeholderTextColor={colors.neutralGrey}
              onChangeText={onChange}
              value={value}
            >
            </S.MultilineTextInput>
          )}
        />
      </S.TripDetailsBox>

      {editMode && (
        <S.CloneTripBox>
          <CloneTripButton setEditMode={setEditMode} />
        </S.CloneTripBox>
      )}

    </S.InputGroupContainer>
  );
};
