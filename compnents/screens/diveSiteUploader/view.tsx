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
import DivingScubaFlag from "../../../icons/svg/diving-scuba-flag";
import Latitude from "../../../icons/svg/latitude";
import Longitude from "../../../icons/svg/longitude";
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
              onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Latitude: text })}
              keyboardType="number-pad"
              />
            </S.TextBuffer>

            <S.TextBuffer>
            <MobileTextInput 
              iconLeft={<Icon name='longitude' fill={colors.neutralGrey}></Icon>}
              placeholder={screenData.DiveSiteAdd.lngPlaceholder}
              onChangeText={(text: string) => setAddSiteVals({ ...addSiteVals, Longitude: text })}
              keyboardType="number-pad"
              />
            </S.TextBuffer>
          </S.InputGroupContainer>
        </Flex>

        <Flex direction="row" justify="space-between" width="84%">
          <TouchableWithoutFeedback onPress={getCurrentLocation}>
            <S.ButtonPosition>
              <S.LocationText>{screenData.DiveSiteAdd.myLocationButton}</S.LocationText>
            </S.ButtonPosition>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={onNavigate}>
            <S.ButtonPosition>
              <S.PinText>{screenData.DiveSiteAdd.pinButton}</S.PinText>
            </S.ButtonPosition>
          </TouchableWithoutFeedback>
        </Flex>

        <S.Hint>{screenData.DiveSiteAdd.myLocationexplainer}</S.Hint>

        <S.ButtonBox>
          <TouchableWithoutFeedback onPress={onSubmit}>
            <S.SubmitButton>
              <S.SubmitText>{screenData.DiveSiteAdd.submitButton}</S.SubmitText>
              <MaterialIcons name="chevron-right" size={30} color="#fff" />
            </S.SubmitButton>
          </TouchableWithoutFeedback>
        </S.ButtonBox>
      </S.ContentContainer>

      <WavyHeaderDynamic image={null} defaultImg="diveSitePhoto" />
    </Flex>
  );
}
