import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as S from './styles';
import TextInputField from '../utils/textInput';
import { useTranslation } from "react-i18next";

interface FormVals {
    email: string;
    password: string;
}

interface IProps {
    formVals: FormVals;
    secureTextEntry: boolean;
    loginFail: string | null;
    setFormVals: (vals: FormVals) => void;
    setSecureTextEntry: (val: boolean) => void;
    moveToLandingPage: () => void;
    moveToForgotPasswordPage: () => void;
    moveToSignUpPage: () => void;
    handleLogin: () => void;
}

export default function LoginPageView({
    formVals,
    loginFail,
    secureTextEntry,
    setFormVals,
    handleLogin,
    moveToSignUpPage,
    moveToLandingPage,
    setSecureTextEntry,
    moveToForgotPasswordPage,
}: IProps) {

    const { t } = useTranslation();

    return (
        <S.Container>
            <MaterialIcons
                name="chevron-left"
                size={48}
                color="darkgrey"
                onPress={moveToLandingPage}
            />

            <S.Content>
                <S.Header>{t('auth:login.title')}</S.Header>

                <TextInputField
                    icon="alternate-email"
                    placeHolderText={t('common:email')}
                    secure={false}
                    onChangeText={(text: string) => setFormVals({ ...formVals, email: text })}
                    style={{ marginTop: 60 }}
                />

                <TextInputField
                    icon="lock-outline"
                    placeHolderText={t('common:password')}
                    setSecureTextEntry={setSecureTextEntry}
                    secure={secureTextEntry}
                    onChangeText={(text: string) => setFormVals({ ...formVals, password: text })}
                    style={{ marginTop: 40 }}
                />

                {loginFail ? <S.ErrorText>{loginFail}</S.ErrorText> : <S.ErrorText />}

                <S.ButtonBox>
                    <TouchableWithoutFeedback onPress={handleLogin}>
                        <S.LoginButton>
                            <S.LoginText>{t('common:login')}</S.LoginText>
                            <MaterialIcons name="chevron-right" size={30} color="#fff" />
                        </S.LoginButton>
                    </TouchableWithoutFeedback>
                </S.ButtonBox>
            </S.Content>

            <S.ForgotBox>
                <TouchableWithoutFeedback onPress={moveToForgotPasswordPage}>
                    <S.PromptLinkText>{t('auth:login.forgot')}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.ForgotBox>

            <S.PromptBox>
                <S.PromptText>{t('auth:login.noAccount')}</S.PromptText>
                <TouchableWithoutFeedback onPress={moveToSignUpPage}>
                    <S.PromptLinkText>{t('common:signup')}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.PromptBox>
        </S.Container>
    );
}
