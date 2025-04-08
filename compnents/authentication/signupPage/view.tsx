import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as S from "./styles";
import TextInputField from "../utils/textInput";
import { useTranslation } from "react-i18next";

interface FormVals {
    name: string;
    email: string;
    password: string;
}

interface IProps {
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
    formVals,
    secureTextEntry,
    regFail,
    setFormVals,
    handleSignUp,
    moveToLandingPage,
    moveToLoginPage,
    setSecureTextEntry,
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
                <S.Header>{t("signup.title")}</S.Header>

                <TextInputField
                    icon="person-outline"
                    placeHolderText={t("signup.name")}
                    secure={false}
                    onChangeText={(text: string) => setFormVals({ ...formVals, name: text })}
                    style={{ marginTop: 60 }}
                />

                <TextInputField
                    icon="alternate-email"
                    placeHolderText={t("signup.email")}
                    secure={false}
                    onChangeText={(text: string) => setFormVals({ ...formVals, email: text })}
                    style={{ marginTop: 40 }}
                />

                <TextInputField
                    icon="lock-outline"
                    placeHolderText={t("signup.password")}
                    setSecureTextEntry={setSecureTextEntry}
                    secure={secureTextEntry}
                    onChangeText={(text: string) => setFormVals({ ...formVals, password: text })}
                    style={{ marginTop: 40 }}
                />

                {regFail ? <S.ErrorText>{regFail}</S.ErrorText> : <S.ErrorText />}

                <TouchableWithoutFeedback onPress={handleSignUp}>
                    <S.ButtonBox>
                        <S.LoginButton>
                            <S.LoginText>{t("signup.button")}</S.LoginText>
                            <MaterialIcons name="chevron-right" size={30} color="#fff" />
                        </S.LoginButton>
                    </S.ButtonBox>
                </TouchableWithoutFeedback>
            </S.Content>

            <S.PromptBox>
                <S.PromptText>{t("signup.prompt")}</S.PromptText>
                <TouchableWithoutFeedback onPress={moveToLoginPage}>
                    <S.PromptLinkText>{t("signup.promptLink")}</S.PromptLinkText>
                </TouchableWithoutFeedback>
            </S.PromptBox>
        </S.Container>
    );
}
