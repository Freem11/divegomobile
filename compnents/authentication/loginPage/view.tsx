import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as S from './styles';
import TextInputField from '../textInput';

interface FormVals {
    email: string;
    password: string;
}

interface IProps {
    title: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    buttonText: string;
    promptText: string;
    promptLinkText: string;
    forgotPromt: string;
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
    title,
    emailPlaceholder,
    passwordPlaceholder,
    buttonText,
    promptText,
    promptLinkText,
    forgotPromt,
    formVals,
    setFormVals,
    secureTextEntry,
    setSecureTextEntry,
    loginFail,
    moveToLandingPage,
    moveToForgotPasswordPage,
    moveToSignUpPage,
    handleLogin,
}: IProps) {
    return (
        <S.Container>
            <MaterialIcons
                name="chevron-left"
                size={48}
                color="darkgrey"
                onPress={moveToLandingPage}
            />

            <S.Content>
                <S.Header>{title}</S.Header>

                <TextInputField
                    icon="alternate-email"
                    placeHolderText={emailPlaceholder}
                    secure={false}
                    onChangeText={(text: string) => setFormVals({ ...formVals, email: text })}
                    style={{ marginTop: 60 }}
                />

                <TextInputField
                    icon="lock-outline"
                    placeHolderText={passwordPlaceholder}
                    setSecureTextEntry={setSecureTextEntry}
                    secure={secureTextEntry}
                    onChangeText={(text: string) => setFormVals({ ...formVals, password: text })}
                    style={{ marginTop: 40 }}
                />

                {loginFail ? <S.ErrorText>{loginFail}</S.ErrorText> : <S.ErrorText />}

                <S.ButtonBox>
                    <TouchableWithoutFeedback onPress={handleLogin}>
                        <S.LoginButton>
                            <S.LoginText>{buttonText}</S.LoginText>
                            <MaterialIcons name="chevron-right" size={30} color="#fff" />
                        </S.LoginButton>
                    </TouchableWithoutFeedback>
                </S.ButtonBox>
            </S.Content>

            <S.ForgotBox>
                <TouchableWithoutFeedback onPress={moveToForgotPasswordPage}>
                    <S.PromptLinkText>{forgotPromt}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.ForgotBox>

            <S.PromptBox>
                <S.PromptText>{promptText}</S.PromptText>
                <TouchableWithoutFeedback onPress={moveToSignUpPage}>
                    <S.PromptLinkText>{promptLinkText}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.PromptBox>
        </S.Container>
    );
}
