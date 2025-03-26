import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TextInputField from '../../authentication/textInput';
import WavyHeaderDynamic from '../wavyHeaderDynamic';
import screenData from '../screenData.json';
import * as S from './styles';
import { FullScreenCenter } from '../../ui/containes';

export default function DiveSiteUploaderView({
    addSiteVals,
    onClose,
    onSubmit,
    onNavigate,
    getCurrentLocation,
    setAddSiteVals
}) {
    return (
        <FullScreenCenter >
            <S.PinText>{screenData.DiveSiteAdd.pinButton}</S.PinText>
            {/* <MaterialIcons
                name="chevron-left"
                size={48}
                color="#fff"
                onPress={onClose}
                style={S.BackButton}
            /> */}
            {/* 
            <S.ContentContainer>
                <S.Header>{screenData.DiveSiteAdd.header}</S.Header>

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

                <S.ButtonOptions>
                    <TouchableWithoutFeedback onPress={getCurrentLocation}>
                        <S.LocationButton>
                            <S.LocationText>{screenData.DiveSiteAdd.myLocationButton}</S.LocationText>
                        </S.LocationButton>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={onNavigate}>
                        <S.PinButton>
                            <S.PinText>{screenData.DiveSiteAdd.pinButton}</S.PinText>
                        </S.PinButton>
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
            </S.ContentContainer> */}

            <WavyHeaderDynamic customStyles={S.SvgCurve} image={null} defaultImg="diveSitePhoto" />
        </FullScreenCenter >
    );
}
