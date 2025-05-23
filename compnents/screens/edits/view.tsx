import React, { useContext, useEffect } from 'react';
import * as S from './styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import { useTranslation } from "react-i18next";
import { Form, FormRules } from "./form";
import { Controller, useForm } from "react-hook-form";
import { BasicFormData } from "./editsParallax";
import Label from "../../reusables/label";

interface Props {
  values: Form;
  onSubmit: (data: any) => void
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
  initialFormData: BasicFormData
}

export default function EditScreenView({
  values,
  onSubmit,
  closeParallax,
  restoreParallax,
  initialFormData
}: Props) {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Form>({
    values: values,
  });
  
  const { t } = useTranslation();

  const handleOnSubmit = (data: Form) => {
    // toast.dismiss();
    onSubmit(data);
  };

  console.log('values', FormRules.name)
  return (
    <S.ContentContainer>
        <S.Header>{initialFormData?.title}</S.Header>

          <S.InputGroupContainer>
          <Label label="Name" />
                <S.TextBuffer>
                <Controller
                control={control}
                name="name"
                rules={FormRules.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MobileTextInput
                    placeholder={t('PicUploader.whenPlaceholder')}
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
                  placeholder={t("TripCreator.tripDescriptionPlaceholder").replace(/\\n/g, '\n')}
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
                 onPress={() => handleOnSubmit} 
                 alt={false} 
                 size='medium'
                 title={t('DiveSiteAdd.submitButton')} 
                 iconRight="chevron-right"
                 />
            </S.ButtonBox>

    </S.ContentContainer>
  );
}
