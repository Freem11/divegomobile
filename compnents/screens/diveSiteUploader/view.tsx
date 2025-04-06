import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import WavyHeaderDynamic from '../wavyHeaderDynamic';
import screenData from '../screenData.json';
import * as S from './styles';
import { Flex } from '../../ui/containes';
import { colors } from '../../styles';
import MobileTextInput from "../../reusables/textInput";
import Button from '../../reusables/button';
import Icon from "../../../icons/Icon";

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
        <MaterialIcons
          name="chevron-left"
          size={moderateScale(48)}
          color={colors.themeWhite}
          onPress={onClose}
        />
      </S.BackButtonWrapper>

      <S.ContentContainer>
        <S.Header>{screenData.DiveSiteAdd.header}</S.Header>

        <Flex>
          <S.InputGroupContainer>
            <S.TextBuffer>
              <MobileTextInput 
              iconLeft={<Icon name='diving-scuba-flag' fill={colors.neutralGrey}></Icon>}
              placeholder={screenData.DiveSiteAdd.siteNamePlaceholder}
              onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Site: text })}
              />
            </S.TextBuffer>

            <S.TextBuffer>
            <MobileTextInput 
              iconLeft={<Icon name='latitude' fill={colors.neutralGrey}></Icon>}
              placeholder={screenData.DiveSiteAdd.latPlaceholder}
              value={addSiteVals.Latitude}
              onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Latitude: text })}
              keyboardType="number-pad"
              />
            </S.TextBuffer>

            <S.TextBuffer>
            <MobileTextInput 
              iconLeft={<Icon name='longitude' fill={colors.neutralGrey}></Icon>}
              placeholder={screenData.DiveSiteAdd.lngPlaceholder}
              value={addSiteVals.Longitude}
              onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Longitude: text })}
              keyboardType="number-pad"
              />
            </S.TextBuffer>
          </S.InputGroupContainer>
        </Flex>

        <Flex direction="row" justify="space-between" width="84%">
            <S.ButtonPosition>
            <TouchableWithoutFeedback onPress={getCurrentLocation}>
                <Button alt={true} title={screenData.DiveSiteAdd.myLocationButton}/>
            </TouchableWithoutFeedback>
            </S.ButtonPosition>

            <S.ButtonPosition>
            <TouchableWithoutFeedback onPress={onNavigate}>
                <Button alt={true} title={screenData.DiveSiteAdd.pinButton}/>
            </TouchableWithoutFeedback>
            </S.ButtonPosition>
        </Flex>

        <S.Hint>{screenData.DiveSiteAdd.myLocationexplainer}</S.Hint>


        <S.ButtonBox>
            <S.SubmitButton>
            <TouchableWithoutFeedback onPress={onSubmit}>
                <Button alt={false} title={screenData.DiveSiteAdd.submitButton} iconRight="chevron-right"/>
            </TouchableWithoutFeedback>
            </S.SubmitButton>
        </S.ButtonBox>
      </S.ContentContainer>

      <WavyHeaderDynamic image={null} defaultImg="diveSitePhoto" />
    </Flex>
  );
}
