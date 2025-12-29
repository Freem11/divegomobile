import React, { } from "react";
import { FieldErrors, UseFormWatch, Controller, Control } from "react-hook-form";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { moderateScale } from "react-native-size-matters";
import { Dimensions } from "react-native";

import { Form } from "../form";
import * as S from "../../styles";
import DynamicSelect from "../../../../reusables/dynamicSelect";
import { colors } from "../../../../styles";
import Icon from "../../../../../icons/Icon";

interface StepXProps {
  image: string
  fieldIndex: number
  control: Control<Form, any, Form>
  watch: UseFormWatch<Form>
  errors: FieldErrors<Form>
  getMoreAnimals: (search: string, limit: number, skip: number) => Promise<any>
}

export const StepX: React.FC<StepXProps> = ({
  image,
  fieldIndex,
  control,
  errors,
  getMoreAnimals
}) => {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get("window").width;
  const fieldName = `SeaLife.${fieldIndex}`;
  const fieldError = errors.SeaLife?.[fieldIndex];

  return (
    <S.InputGroupContainer>
      <S.Title>{t("PicUploader.stepXTitle")}</S.Title>
      <S.Subtitle>{t("PicUploader.stepXDescription")}</S.Subtitle>
      <S.MiniSpacer />
      <Controller
        control={control}
        name={fieldName as "SeaLife.0"}
        rules={{
          required: "A sea life species must be entered for this photo.",
          validate: (value) =>
            (value && value.key && value.key !== "") || "Please make a selection.",
        }}
        render={({ field: { onChange, value }, fieldState: { isTouched } }) => (
          <DynamicSelect
            allowCreate={true}
            labelInValue={true}
            modeSelectedTags="on"
            placeholder={t("PicUploader.seaLifePlaceholder")}
            getMoreOptions={getMoreAnimals}
            iconLeft={<Icon name="fish" fill={colors.primaryBlue} />}
            iconRight={<Icon name="chevron-down" fill={colors.neutralGrey} />}
            error={fieldError}
            value={value}
            isTouched={isTouched}
            onChange={onChange}
          />
        )}
      />
      <S.MiniSpacer />
      <S.Title>{t("PicUploader.seaLifeId")}</S.Title>
      <Image
        source={{ uri: image }}
        style={{ width: screenWidth - moderateScale(32), height: screenWidth - moderateScale(32), resizeMode: "cover", borderRadius: moderateScale(40) }}
        contentFit="cover"
        transition={1000}
      />

    </S.InputGroupContainer>
  );
};