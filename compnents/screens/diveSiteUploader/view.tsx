import React, { useContext, useEffect } from 'react';
import * as S from './styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import { useTranslation } from "react-i18next";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { Controller, useForm } from "react-hook-form";
import { Form, FormRules } from "./form";

// interface DiveSiteVals {
//   Site: string;
//   Latitude: string;
//   Longitude: string;
// }

interface Props {
  values: Form;
  onSubmit: () => void;
  // addSiteVals: DiveSiteVals;
  // setAddSiteVals: (vals: DiveSiteVals) => void;
  getCurrentLocation: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
}

export default function DiveSiteUploaderView({
  values,
  onSubmit,
  // addSiteVals,
  // setAddSiteVals,
  getCurrentLocation,
  closeParallax,
  restoreParallax
}: Props) {

  const { t } = useTranslation();
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);
  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<Form>({
    // values: props.values,
    values: values
  });

  useEffect(() => {
    if(levelTwoScreen){
      restoreParallax();
    }
  }, [levelTwoScreen]);

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
                  value={value.toString()}
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
                  value={value.toString()}
                  onChangeText={onChange}
                  keyboardType="number-pad"
               />
              </S.TextBuffer>
            )}
          />

           </S.InputGroupContainer>

          <S.ButtonSpread>

            <Button 
                   onPress={getCurrentLocation} 
                   alt={true} 
                   size='medium'
                   title={t('DiveSiteAdd.myLocationButton')}
                 />

                 <Button 
                   onPress={() => closeParallax(1)} 
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
