import React from 'react';
import WavyHeaderDynamic from '../wavyHeaderDynamic';
import * as S from './styles';
import { Flex } from '../../ui/containes';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import ButtonIcon from '../../reusables/buttonIcon';
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface DiveSiteVals {
  Site: string;
  Latitude: string;
  Longitude: string;
}

interface Props {
  onClose: () => void;
  onSubmit: () => void;
  onNavigate: () => void;
  addSiteVals: DiveSiteVals;
  setAddSiteVals: (vals: DiveSiteVals) => void;
  getCurrentLocation: () => void;
}

export default function DiveSiteUploaderView({
  onClose,
  onSubmit,
  onNavigate,
  addSiteVals,
  setAddSiteVals,
  getCurrentLocation,
}: Props) {

  const { t } = useTranslation();
  return (
    <S.ContentContainer>
        <S.Header>{t('DiveSiteAdd.header')}</S.Header>

          <S.InputGroupContainer>
             <S.TextBuffer>
               <MobileTextInput 
               iconLeft="diving-scuba-flag"
               placeholder={t('DiveSiteAdd.siteNamePlaceholder')}
               onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Site: text })}
               />
             </S.TextBuffer>

                <S.TextBuffer>
             <MobileTextInput 
               iconLeft="latitude"
               placeholder={t('DiveSiteAdd.latPlaceholder')}
               value={addSiteVals.Latitude}
               onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Latitude: text })}
               keyboardType="number-pad"
               />
             </S.TextBuffer>

             <S.TextBuffer>
             <MobileTextInput 
               iconLeft="longitude"
               placeholder={t('DiveSiteAdd.lngPlaceholder')}
               value={addSiteVals.Longitude}
               onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Longitude: text })}
               keyboardType="number-pad"
               />
             </S.TextBuffer>
           </S.InputGroupContainer>

          <S.ButtonSpread>

            <Button 
                   onPress={getCurrentLocation} 
                   alt={true} 
                   size='medium'
                   title={t('DiveSiteAdd.myLocationButton')}
                 />

                 <Button 
                   onPress={onNavigate} 
                   alt={true} 
                   size='medium'
                   title={t('DiveSiteAdd.pinButton')}
                 />
           </S.ButtonSpread>

                 <S.Hint>{t('DiveSiteAdd.myLocationexplainer')}</S.Hint>

            <S.ButtonBox>
               <Button 
                 onPress={onSubmit} 
                 alt={false} 
                 size='medium'
                 title={t('DiveSiteAdd.submitButton')} 
                 iconRight="chevron-right"
                 />
            </S.ButtonBox>

    </S.ContentContainer>
  );
}
