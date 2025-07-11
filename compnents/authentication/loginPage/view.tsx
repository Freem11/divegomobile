import React from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";
import Animated from "react-native-reanimated";

import SecureTextInput from "../../reusables/secureTextInput";
import MobileTextInput from "../../reusables/textInput";
import ButtonIcon from "../../reusables/buttonIcon";
import Button from "../../reusables/button";
import { colors } from "../../styles";

import * as S from "./styles";

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

  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
  
  return (
    <S.Container>

      <AnimatedSafeAreaView style={[S.styles.safeArea]}>
        <S.BackButtonWrapper>
          <ButtonIcon 
            icon="chevron-left"
            onPress={moveToLandingPage}
            size="small"
            fillColor={colors.neutralGrey}
          />

        </S.BackButtonWrapper>
      </AnimatedSafeAreaView> 
       
      <S.Content>
        <S.Header>{t("Common.login")}</S.Header>

        <S.TextInputWrapper>
          <MobileTextInput 
            iconLeft="at"
            placeholder={t("Common.email")}
            value={formVals.email}
            onChangeText={(text: string) => setFormVals({ ...formVals, email: text })}
          />
        </S.TextInputWrapper>
                
        <S.SecureTextInputWrapper>
          <SecureTextInput 
            onChangeText={(text: string) => setFormVals({ ...formVals, password: text })}
            placeholder={t("Common.password")}
          />
        </S.SecureTextInputWrapper>

        {loginFail ? <S.ErrorText>{loginFail}</S.ErrorText> : <S.ErrorText />}

        <S.ButtonBox>
          <Button 
            onPress={handleLogin} 
            alt={false} 
            size="medium"
            title={t("Common.login")} 
            iconRight="chevron-right"
          />
        </S.ButtonBox>
      </S.Content>

      <S.ForgotBox>
        <TouchableWithoutFeedback onPress={moveToForgotPasswordPage}>
          <S.PromptLinkText>{t("Auth.forgotPassword")}</S.PromptLinkText>
        </TouchableWithoutFeedback>
      </S.ForgotBox>

      <S.PromptBox>
        <S.PromptText>{t("Auth.noAccount")}</S.PromptText>
        <TouchableWithoutFeedback onPress={moveToSignUpPage}>
          <S.PromptLinkText>{t("Common.signup")}</S.PromptLinkText>
        </TouchableWithoutFeedback>
      </S.PromptBox>
    </S.Container>
  );
}
