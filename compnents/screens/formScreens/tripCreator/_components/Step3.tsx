import React, { } from "react";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import { Form } from "../form";
import * as S from "../../styles";
import { ReviewPhotos } from "../../../../../entities/diveSiteReview";

interface Step3Props {
  control: Control<Form, any, Form>
  setValue: UseFormSetValue<Form>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
  existingPhotos: ReviewPhotos[]
}

export const Step3: React.FC<Step3Props> = ({
  control,
  setValue,
  watch,
  errors,
}) => {
  const { t } = useTranslation();

  //   const currentFormPhotos = watch("Photos");
  //   setValue("SiteIDs", [...currentFormPhotos, ...newPicArray]);
  // };

  return (
    <S.InputGroupContainer>
      <S.Title>{t("DiveSiteReviewer.step3Title")}</S.Title>
      <S.Subtitle style={{ marginBottom: moderateScale(12) }}>{t("DiveSiteReviewer.step3Description")}</S.Subtitle>

    </S.InputGroupContainer>
  );
};
