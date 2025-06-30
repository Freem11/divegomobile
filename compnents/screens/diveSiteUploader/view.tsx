import React, { useContext, useEffect, useRef } from 'react';
import * as S from './styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import { useTranslation } from "react-i18next";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { Controller, useForm } from "react-hook-form";
import { Form, FormRules } from "./form";
import { useMapStore } from "../../googleMap/useMapStore";
import { ScreenReturn } from "../../googleMap/types";

interface Props {
  values: Form;
  onSubmit: (data: any) => void;
  getCurrentLocation: (formData: Required<Form>) => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
}

export default function DiveSiteUploaderView({
  values,
  onSubmit,
  getCurrentLocation,
  closeParallax,
  restoreParallax
}: Props) {

  const { t } = useTranslation();
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const setFormValues = useMapStore((state) => state.actions.setFormValues);
  const { control, handleSubmit, formState: { isSubmitting, errors }, getValues, reset } = useForm<Form>({
    defaultValues: values
  });

  useEffect(() => {
    if(levelTwoScreen){
      restoreParallax();
    }
  }, [levelTwoScreen]);

  const handleMapFlip = async (formData: Required<Form>) => {
    setMapConfig(1, ScreenReturn.SiteSubmitter)
    closeParallax(1)
    setFormValues(formData)
  }

  useEffect(() => {
    reset({
      Site: values.Site ?? "",
      Latitude: values.Latitude ?? undefined,
      Longitude: values.Longitude ?? undefined,
    });
  }, [values.Latitude, values.Longitude]);

  return (
    <S.ContentContainer>
        <S.Header>{t('DiveSiteAdd.header')}</S.Header>

          <S.InputGroupContainer>
          <Controller
            control={control}
            name="Site"
            rules={FormRules.Site}
            render={({ field: { onChange, value } }) => (
              <S.TextBuffer>
                <MobileTextInput 
                error={errors.Site}
                iconLeft="diving-scuba-flag"
                placeholder={t('DiveSiteAdd.siteNamePlaceholder')}
                onChangeText={onChange}
                value={value}
                />
              </S.TextBuffer>
            )}
          />
          <Controller
            control={control}
            name="Latitude"
            rules={FormRules.Latitude}
            render={({ field: { onChange, value } }) => (
              <S.TextBuffer>
                <MobileTextInput 
                  error={errors.Latitude}
                  iconLeft="latitude"
                  placeholder={t('DiveSiteAdd.latPlaceholder')}
                  value={value ? String(value): null}
                  onChangeText={onChange}
                  keyboardType="number-pad"
               />
              </S.TextBuffer>
            )}
          />


          <Controller
            control={control}
            name="Longitude"
            rules={FormRules.Longitude}
            render={({ field: { onChange, value } }) => (
              <S.TextBuffer>
                <MobileTextInput 
                error={errors.Longitude}
                  iconLeft="longitude"
                  placeholder={t('DiveSiteAdd.lngPlaceholder')}
                  value={value ? String(value): null}
                  onChangeText={onChange}
                  keyboardType="number-pad"
               />
              </S.TextBuffer>
            )}
          />

           </S.InputGroupContainer>

          <S.ButtonSpread>

            <Button 
                   onPress={() => {
                    const data = getValues();
                    getCurrentLocation(data as Required<Form>);
                  }} 
                   alt={true} 
                   size='medium'
                   title={t('DiveSiteAdd.myLocationButton')}
                 />

                 <Button 
                     onPress={() => {
                      const data = getValues();
                      handleMapFlip(data as Required<Form>);
                    }} 
                   alt={true} 
                   size='medium'
                   title={t('DiveSiteAdd.pinButton')}
                 />
           </S.ButtonSpread>

                 <S.Hint>{t('DiveSiteAdd.myLocationexplainer')}</S.Hint>

            <S.ButtonBox>
               <Button 
                 onPress={() => handleSubmit(onSubmit)()} 
                 alt={false} 
                 size='medium'
                 title={t('DiveSiteAdd.submitButton')} 
                 iconRight="chevron-right"
                 />
            </S.ButtonBox>

    </S.ContentContainer>
  );
}
