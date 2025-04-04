import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as S from "./styles";
import TextInputField from "../textInput";

interface FormVals {
    name: string;
    email: string;
    password: string;
}

interface IProps {
    title: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    buttonText: string;
    promptText: string;
    promptLinkText: string;
    formVals: FormVals;
    secureTextEntry: boolean;
    regFail: string | null;
    setFormVals: (vals: FormVals) => void;
    setSecureTextEntry: (val: boolean) => void;
    moveToLandingPage: () => void;
    moveToLoginPage: () => void;
    handleSignUp: () => void;
}

export default function CreateAccountPageView({
    title,
    namePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    buttonText,
    promptText,
    promptLinkText,
    formVals,
    secureTextEntry,
    regFail,
    setFormVals,
    handleSignUp,
    moveToLandingPage,
    moveToLoginPage,
    setSecureTextEntry,
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
                    icon="person-outline"
                    placeHolderText={namePlaceholder}
                    secure={false}
                    onChangeText={(text: string) => setFormVals({ ...formVals, name: text })}
                    style={{ marginTop: 60 }}
                />

                <TextInputField
                    icon="alternate-email"
                    placeHolderText={emailPlaceholder}
                    secure={false}
                    onChangeText={(text: string) => setFormVals({ ...formVals, email: text })}
                    style={{ marginTop: 40 }}
                />

                <TextInputField
                    icon="lock-outline"
                    placeHolderText={passwordPlaceholder}
                    setSecureTextEntry={setSecureTextEntry}
                    secure={secureTextEntry}
                    onChangeText={(text: string) => setFormVals({ ...formVals, password: text })}
                    style={{ marginTop: 40 }}
                />

                {regFail ? <S.ErrorText>{regFail}</S.ErrorText> : <S.ErrorText />}

                <TouchableWithoutFeedback onPress={handleSignUp}>
                    <S.ButtonBox>
                        <S.LoginButton>
                            <S.LoginText>{buttonText}</S.LoginText>
                            <MaterialIcons name="chevron-right" size={30} color="#fff" />
                        </S.LoginButton>
                    </S.ButtonBox>
                </TouchableWithoutFeedback>
            </S.Content>

            <S.PromptBox>
                <S.PromptText>{promptText}</S.PromptText>
                <TouchableWithoutFeedback onPress={moveToLoginPage}>
                    <S.PromptLinkText>{promptLinkText}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.PromptBox>
        </S.Container>
    );
}
