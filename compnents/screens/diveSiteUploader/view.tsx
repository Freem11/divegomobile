import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import WavyHeaderDynamic from '../wavyHeaderDynamic';
import screenData from '../screenData.json';
import * as S from './styles';
import { Flex } from '../../ui/containes';
import { colors } from '../../styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import ButtonIcon from '../../reusables/buttonIcon';

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
  return (
    <Flex>
      <S.BackButtonWrapper>
        <ButtonIcon 
        icon="chevron-left"
        onPress={onClose}
        size='small'
        />
      </S.BackButtonWrapper>

      <S.ContentContainer>
        <S.Header>{screenData.DiveSiteAdd.header}</S.Header>

        <Flex>
          <S.InputGroupContainer>
            <S.TextBuffer>
              <MobileTextInput 
              iconLeft="diving-scuba-flag"
              placeholder={screenData.DiveSiteAdd.siteNamePlaceholder}
              onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Site: text })}
              />
            </S.TextBuffer>

            <S.TextBuffer>
            <MobileTextInput 
              iconLeft="latitude"
              placeholder={screenData.DiveSiteAdd.latPlaceholder}
              value={addSiteVals.Latitude}
              onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Latitude: text })}
              keyboardType="number-pad"
              />
            </S.TextBuffer>

            <S.TextBuffer>
            <MobileTextInput 
              iconLeft="longitude"
              placeholder={screenData.DiveSiteAdd.lngPlaceholder}
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
              <Button 
                onPress={onSubmit} 
                alt={false} 
                size='medium'
                title={screenData.DiveSiteAdd.submitButton} 
                iconRight="chevron-right"
                />
        </S.ButtonBox>
      </S.ContentContainer>

      <WavyHeaderDynamic image={null} defaultImg="diveSitePhoto" />
    </Flex>
  );
}
