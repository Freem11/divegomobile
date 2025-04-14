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
                <S.Header>{t('Auth.diveIn')}</S.Header>

                <TextInputField
                    icon="alternate-email"
                    placeHolderText={t('Common.email')}
                    secure={false}
                    onChangeText={(text: string) => setFormVals({ ...formVals, email: text })}
                    style={{ marginTop: 60 }}
                />

                <TextInputField
                    icon="lock-outline"
                    placeHolderText={t('Common.password')}
                    setSecureTextEntry={setSecureTextEntry}
                    secure={secureTextEntry}
                    onChangeText={(text: string) => setFormVals({ ...formVals, password: text })}
                    style={{ marginTop: 40 }}
                />

                {loginFail ? <S.ErrorText>{loginFail}</S.ErrorText> : <S.ErrorText />}

                <S.ButtonBox>
                    <TouchableWithoutFeedback onPress={handleLogin}>
                        <S.LoginButton>
                            <S.LoginText>{t('Common.login')}</S.LoginText>
                            <MaterialIcons name="chevron-right" size={30} color="#fff" />
                        </S.LoginButton>
                    </TouchableWithoutFeedback>
                </S.ButtonBox>
            </S.Content>

            <S.ForgotBox>
                <TouchableWithoutFeedback onPress={moveToForgotPasswordPage}>
                    <S.PromptLinkText>{t('Auth.forgotPassword')}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.ForgotBox>

            <S.PromptBox>
                <S.PromptText>{t('Auth.noAccount')}</S.PromptText>
                <TouchableWithoutFeedback onPress={moveToSignUpPage}>
                    <S.PromptLinkText>{t('Common.signup')}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.PromptBox>
        </S.Container>
    );
}
