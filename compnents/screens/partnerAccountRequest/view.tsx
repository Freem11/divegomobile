import React, { useContext, useEffect } from 'react';
import * as S from './styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import { useTranslation } from "react-i18next";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { Controller, useForm } from "react-hook-form";
import { Form, FormRules } from "./form";
import { ScreenReturn } from "../../googleMap/types";
import { useMapStore } from "../../googleMap/useMapStore";


interface Props {
  values: Form;
  onSubmit: (data: any) => void;
  getCurrentLocation: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
}

export default function PartnerAccountRequestPageView({
  values,
  onSubmit,
  getCurrentLocation,
  closeParallax,
  restoreParallax
}: Props) {

  const { t } = useTranslation();
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({
    values: values
  });

  useEffect(() => {
    if(levelTwoScreen){
      restoreParallax();
    }
  }, [levelTwoScreen]);

  const handleMapFlip = async () => {
    setMapConfig(1, ScreenReturn.PartnerRequestPage)
    closeParallax(1)
  }
  
  return (
    <S.ContentContainer>
        <S.Header>{t('PartnerRequestPage.header')}</S.Header>

        <S.MainExplainer>
            {t('PartnerRequestPage.explanation')}
          </S.MainExplainer>

          <S.InputGroupContainer>
          <Controller
            control={control}
            name="OrgName"
            rules={FormRules.OrgName}
            render={({ field: { onChange, value } }) => (
              <S.TextBuffer>
                <MobileTextInput 
                error={errors.OrgName}
                iconLeft="store"
                placeholder={t('PartnerRequestPage.businessPlaceholder')}
                onChangeText={onChange}
                value={value}
                />
              </S.TextBuffer>
            )}
          />
            <S.Explainer>
              {t('PartnerRequestPage.businessExplainer')}
            </S.Explainer>

          <Controller
            control={control}
            name="URL"
            rules={FormRules.OrgName}
            render={({ field: { onChange, value } }) => (
              <S.TextBuffer>
                <MobileTextInput 
                error={errors.URL}
                iconLeft="diving-scuba-flag"
                placeholder={t('PartnerRequestPage.websitePlaceholder')}
                onChangeText={onChange}
                value={value}
                />
              </S.TextBuffer>
            )}
          />
            <S.Explainer>
              {t('PartnerRequestPage.websiteExplainer')}
            </S.Explainer>

          <Controller
            control={control}
            name="Latitude"
            rules={FormRules.Latitude}
            render={({ field: { onChange, value } }) => (
              <S.TextBuffer>
                <MobileTextInput 
                  error={errors.Latitude}
                  iconLeft="latitude"
                  placeholder={t('PartnerRequestPage.latPlaceholder')}
                  value={value ? String(value): null}
                  onChangeText={onChange}
                  keyboardType="number-pad"
               />
              </S.TextBuffer>
            )}
          />
          
           <S.Buffer/>

          <Controller
            control={control}
            name="Longitude"
            rules={FormRules.Longitude}
            render={({ field: { onChange, value } }) => (
              <S.TextBuffer>
                <MobileTextInput 
                error={errors.Longitude}
                  iconLeft="longitude"
                  placeholder={t('PartnerRequestPage.lngPlaceholder')}
                  value={value ? String(value): null}
                  onChangeText={onChange}
                  keyboardType="number-pad"
               />
              </S.TextBuffer>
            )}
          />

            <S.Explainer>
              {t('PartnerRequestPage.latLngExplainer')}
            </S.Explainer>

           </S.InputGroupContainer>

          <S.ButtonSpread>

            <Button 
                   onPress={getCurrentLocation} 
                   alt={true} 
                   size='medium'
                   title={t('DiveSiteAdd.myLocationButton')}
                 />

                 <Button 
                   onPress={() => handleMapFlip()} 
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

