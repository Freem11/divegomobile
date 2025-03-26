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

export default function DiveSiteUploaderView({
    onClose,
    onSubmit,
    onNavigate,
    addSiteVals,
    setAddSiteVals,
    getCurrentLocation,
}) {
    return (
        <Flex >
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
                            <TextInputField
                                icon="diving-scuba-flag"
                                inputValue={addSiteVals.Site}
                                placeHolderText={screenData.DiveSiteAdd.siteNamePlaceholder}
                                vectorIcon="MaterialCommunityIcons"
                                onChangeText={(text) => setAddSiteVals({ ...addSiteVals, Site: text })}
                                secure={false}
                            />
                        </S.TextBuffer>

                        <S.TextBuffer>
                            <TextInputField
                                icon="latitude"
                                inputValue={addSiteVals.Latitude}
                                placeHolderText={screenData.DiveSiteAdd.latPlaceholder}
                                keyboardConfig="number-pad"
                                vectorIcon="MaterialCommunityIcons"
                                onChangeText={(text) => setAddSiteVals({ ...addSiteVals, Latitude: text })}
                                secure={false}
                            />
                        </S.TextBuffer>

                        <S.TextBuffer>
                            <TextInputField
                                icon="longitude"
                                inputValue={addSiteVals.Longitude}
                                placeHolderText={screenData.DiveSiteAdd.lngPlaceholder}
                                keyboardConfig="number-pad"
                                vectorIcon="MaterialCommunityIcons"
                                onChangeText={(text) => setAddSiteVals({ ...addSiteVals, Longitude: text })}
                                secure={false}
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
        </Flex >
    );
}

