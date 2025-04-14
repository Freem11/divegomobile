import React from 'react';
import WavyHeaderDynamic from '../wavyHeaderDynamic';
import * as S from './styles';
import { Flex } from '../../ui/containes';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import ButtonIcon from '../../reusables/buttonIcon';
import { useTranslation } from "react-i18next";

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
    <Flex>
      <S.BackButtonWrapper>
        <ButtonIcon 
        icon="chevron-left"
        onPress={onClose}
        size='small'
        />
        {/* <MaterialIcons
          name="chevron-left"
          size={moderateScale(48)}
          color={colors.themeWhite}
          onPress={onClose}
        /> */}
      </S.BackButtonWrapper>

      <S.ContentContainer>
        <S.Header>{t('DiveSiteAdd.header')}</S.Header>

        <Flex>
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
        </Flex>

        <Flex direction="row" justify="space-between" width="84%">
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
        </Flex>

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

      <WavyHeaderDynamic image={null} defaultImg="diveSitePhoto" />
    </Flex>
  );
}
