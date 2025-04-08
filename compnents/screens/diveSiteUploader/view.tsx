import React from 'react';
import WavyHeaderDynamic from '../wavyHeaderDynamic';
import screenData from '../screenData.json';
import * as S from './styles';
import { Flex } from '../../ui/containes';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import SubmitButton from "../../reusables/submitButton";
import ButtonIcon from '../../reusables/buttonIcon';
import { Form, FormRules } from './form';
import { FieldErrors, useForm, Controller } from "react-hook-form";


interface DiveSiteVals {
  Site:       string;
  Latitude:   string;
  Longitude:  string;
}

interface Props {
  values?:    Form
  onClose: () => void;
  onSubmit: (data: Form) => void
  onNavigate: () => void;
  addSiteVals: DiveSiteVals;
  setAddSiteVals: (vals: DiveSiteVals) => void;
  getCurrentLocation: () => void;
}

export default function DiveSiteUploaderView({
  values,
  onClose,
  onSubmit,
  onNavigate,
  getCurrentLocation,
}: Props) {
  const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<Form>({
    values: values,
  });
  
  const onSubmitForm = (data: Form) => {
    console.log(data)
    // toast.dismiss();
    onSubmit(data);
  };

  const handleError = (errors: FieldErrors<Form>) => {
    // toast.dismiss();
    Object.values(errors).forEach((error) => {
      if (error?.message) {
        console.log(error.message)
        // toast.error(error.message);
      }
    });
  };

  const onCloseForm = async () => {
      onClose()
      reset()
  };


  return (
    <Flex>
      <S.BackButtonWrapper>
        <ButtonIcon 
        icon="chevron-left"
        onPress={onCloseForm}
        size='small'
        />
      </S.BackButtonWrapper>

      <S.ContentContainer>
        <S.Header>{screenData.DiveSiteAdd.header}</S.Header>

        <Flex>
          <S.InputGroupContainer>
            <S.TextBuffer>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MobileTextInput 
                  iconLeft="diving-scuba-flag"
                  placeholder={screenData.DiveSiteAdd.siteNamePlaceholder}
                  value={value}
                  onChangeText={onChange}
                  />
                )}
                name="Site"
                rules={FormRules.Site}
              />
            </S.TextBuffer>

            <S.TextBuffer>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MobileTextInput 
                  iconLeft="latitude"
                  placeholder={screenData.DiveSiteAdd.latPlaceholder}
                  value={value && value.toString()}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                  />
                )}
                name='Latitude'
                rules={FormRules.Latitude}
              />
            </S.TextBuffer>

            <S.TextBuffer>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MobileTextInput 
                  iconLeft="longitude"
                  placeholder={screenData.DiveSiteAdd.lngPlaceholder}
                  value={value && value.toString()}
                  onChangeText={onChange}
                  keyboardType="number-pad"
                  />
                )}
                name="Longitude"
                rules={FormRules.Longitude}
              />
            </S.TextBuffer>
          </S.InputGroupContainer>
        </Flex>

        <Flex direction="row" justify="space-between" width="84%">
                <Button 
                  onPress={getCurrentLocation} 
                  alt={true} 
                  size='medium'
                  title={screenData.DiveSiteAdd.myLocationButton}
                />

                <Button 
                  onPress={onNavigate} 
                  alt={true} 
                  size='medium'
                  title={screenData.DiveSiteAdd.pinButton}
                />
        </Flex>

        <S.Hint>{screenData.DiveSiteAdd.myLocationexplainer}</S.Hint>

        <S.ButtonBox>
              <SubmitButton 
                onPress={handleSubmit(onSubmitForm, handleError)} 
                alt={false} 
                size='medium'
                type="submit"
                title={screenData.DiveSiteAdd.submitButton} 
                iconRight="chevron-right"
                disabled={isSubmitting}
                />
        </S.ButtonBox>
      </S.ContentContainer>

      <WavyHeaderDynamic image={null} defaultImg="diveSitePhoto" />
    </Flex>
  );
}
