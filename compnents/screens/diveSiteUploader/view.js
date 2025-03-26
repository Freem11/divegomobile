import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import TextInputField from '../../authentication/textInput';
import WavyHeaderDynamic from '../wavyHeaderDynamic';
import screenData from '../screenData.json';
import * as S from './styles';
import { Flex } from '../../ui/containes';
import { colors } from '../../styles';

// continue:
// flex, absolute, array of input ? 
export default function DiveSiteUploaderView({
    addSiteVals,
    onClose,
    onSubmit,
    onNavigate,
    getCurrentLocation,
    setAddSiteVals
}) {
    return (
        <S.FullScreenCenter>
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
                <S.InputGroupContainer>


                    <S.TextBuffer>
                        <TextInputField
                            icon="diving-scuba-flag"
                            inputValue={addSiteVals.Site}
                            placeHolderText={screenData.DiveSiteAdd.siteNamePlaceholder}
                            secure={false}
                            vectorIcon="MaterialCommunityIcons"
                            onChangeText={(text) => setAddSiteVals({ ...addSiteVals, Site: text })}
                        />
                    </S.TextBuffer>

                    <S.TextBuffer>
                        <TextInputField
                            icon="latitude"
                            inputValue={addSiteVals.Latitude}
                            placeHolderText={screenData.DiveSiteAdd.latPlaceholder}
                            vectorIcon="MaterialCommunityIcons"
                            keyboardConfig="number-pad"
                            secure={false}
                            onChangeText={(text) => setAddSiteVals({ ...addSiteVals, Latitude: text })}
                        />
                    </S.TextBuffer>

                    <S.TextBuffer>
                        <TextInputField
                            icon="longitude"
                            inputValue={addSiteVals.Longitude}
                            placeHolderText={screenData.DiveSiteAdd.lngPlaceholder}
                            vectorIcon="MaterialCommunityIcons"
                            keyboardConfig="number-pad"
                            secure={false}
                            onChangeText={(text) => setAddSiteVals({ ...addSiteVals, Longitude: text })}
                        />
                    </S.TextBuffer>
                </S.InputGroupContainer>

                <S.ButtonOptions>
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
                </S.ButtonOptions>

                <S.Explainer>{screenData.DiveSiteAdd.myLocationexplainer}</S.Explainer>

                <S.ButtonBox>
                    <TouchableWithoutFeedback onPress={onSubmit}>
                        <S.SubmitButton>
                            <S.SubmitText>{screenData.DiveSiteAdd.submitButton}</S.SubmitText>
                            <MaterialIcons name="chevron-right" size={30} color="#fff" />
                        </S.SubmitButton>
                    </TouchableWithoutFeedback>
                </S.ButtonBox>
            </S.ContentContainer>

            <WavyHeaderDynamic customStyles={S.SvgCurve} image={null} defaultImg="diveSitePhoto" />
        </S.FullScreenCenter >
    );
}

