import React, { useContext, useEffect } from 'react';
import * as S from './styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import { useTranslation } from "react-i18next";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";

interface DiveSiteVals {
  Site: string;
  Latitude: string;
  Longitude: string;
}

interface Props {
  onSubmit: () => void;
  addSiteVals: DiveSiteVals;
  setAddSiteVals: (vals: DiveSiteVals) => void;
  getCurrentLocation: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void;
}

export default function DiveSiteUploaderView({
  onSubmit,
  addSiteVals,
  setAddSiteVals,
  getCurrentLocation,
  closeParallax,
  restoreParallax
}: Props) {

  const { t } = useTranslation();
  const { levelTwoScreen } = useContext(LevelTwoScreenContext);

  useEffect(() => {
    if(levelTwoScreen){
      restoreParallax();
    }
  }, [levelTwoScreen]);
  
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
                   onPress={() => closeParallax(1)} 
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
