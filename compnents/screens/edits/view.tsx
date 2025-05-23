import React, { useContext, useEffect } from 'react';
import * as S from './styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import { useTranslation } from "react-i18next";
import { Form, FormRules } from "./form";
import { Controller, useForm } from "react-hook-form";

interface Props {
  values: Form;
  onSubmit: (data: any) => void
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
}

export default function EditScreenView({
  values,
  onSubmit,
  closeParallax,
  restoreParallax
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

  return (
    <S.ContentContainer>
        <S.Header>{t('DiveSiteAdd.header')}</S.Header>

          <S.InputGroupContainer>
                <S.TextBuffer>
                <Controller
                control={control}
                name="name"
                rules={FormRules.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MobileTextInput
                    iconLeft="calendar-month"
                    placeholder={t('PicUploader.whenPlaceholder')}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    editable={false}
                  />
                )}
              />
             </S.TextBuffer>

             <S.TextBuffer>
             <Controller
                control={control}
                name="bio"
                rules={FormRules.bio}
                render={({ field: { onChange, onBlur, value } }) => (
                  <MobileTextInput
                    iconLeft="calendar-month"
                    placeholder={t('PicUploader.whenPlaceholder')}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    editable={false}
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
