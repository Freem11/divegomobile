import React, { } from "react";
import { useTranslation } from "react-i18next";
import { Control, Controller } from "react-hook-form";

import MobileTextInput from "../../reusables/textInput";
import Button from "../../reusables/button";
import Label from "../../reusables/label";
import { colors } from "../../styles";

import { Form, FormRules } from "./form";
import * as S from "./styles";

interface Props {
  editInfo: string
  control: Control<Form, any, Form>
  onSubmit: (data: any) => void
}

export default function EditScreenView({
  editInfo,
  control,
  onSubmit,
}: Props) {

  const { t } = useTranslation();

  return (
    <S.ContentContainer>
      <S.Header>{`Update ${editInfo === "DiveShop" ? "My Dive Centre" : "My Profile"} `}</S.Header>

      <S.InputGroupContainer>
        <Label label="Name" />
        <S.TextBuffer>
          <Controller
            control={control}
            name="name"
            rules={FormRules.name}
            render={({ field: { onChange, onBlur, value } }) => (
              <MobileTextInput
                placeholder={"test"}
                placeholderTextColor={colors.neutralGrey}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
        </S.TextBuffer>

        <Label label="Biography" />
        <S.TextBuffer>
          <Controller
            control={control}
            name="bio"
            rules={FormRules.bio}
            render={({ field: { onChange, onBlur, value } }) => (
              <S.MultilineTextInput
                multiline
                placeholder={"test"}
                placeholderTextColor={colors.neutralGrey}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </S.TextBuffer>
      </S.InputGroupContainer>

      <S.ButtonBox>
        <Button
          onPress={onSubmit}
          alt={false}
          size="medium"
          title={t("DiveSiteAdd.submitButton")}
          iconRight="chevron-right"
        />
      </S.ButtonBox>

    </S.ContentContainer>
  );
}
