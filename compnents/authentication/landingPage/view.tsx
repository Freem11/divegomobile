import React from "react";
import { Image, TouchableWithoutFeedback, } from "react-native";
import WavyHeader from "../../wavyHeader";
import * as S from "./styles";
import googleLogo from "../../png/loginIcons/google.png";
import facebookLogo from "../../png/loginIcons/facebook.png";
import appleLogo from "../../png/loginIcons/apple.png";
import { useTranslation } from "react-i18next";

interface IProps {
  isSignedIn: boolean;
  appleAuthAvailable: boolean;
  onLogin: () => void;
  onSignUp: () => void;
  onGoogle: () => void;
  onFacebook: () => void;
  onApple: () => void;
}

export default function LandingPageView({
  isSignedIn,
  appleAuthAvailable,
  onLogin,
  onSignUp,
  onGoogle,
  onFacebook,
  onApple,
}: IProps) {
  const { t } = useTranslation();

  return (
    <S.Container>
      <S.StyledScrollView>
        <S.Header>{t("landing.title")}</S.Header>

        <TouchableWithoutFeedback onPress={onLogin}>
          <S.LoginButton>
            <S.LoginText>{t("landing.loginButton")}</S.LoginText>
          </S.LoginButton>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={onSignUp}>
          <S.RegisterButton>
            <S.RegisterText>{t("landing.registerButton")}</S.RegisterText>
          </S.RegisterButton>
        </TouchableWithoutFeedback>

        <S.SocialText>{t("landing.socialText")}</S.SocialText>

        <S.IconRow>
          <TouchableWithoutFeedback onPress={onGoogle} disabled={isSignedIn}>
            <S.GoogleButton>
              <Image source={googleLogo} style={S.GLogo} />
            </S.GoogleButton>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={onFacebook} disabled={isSignedIn}>
            <S.FacebookButton>
              <Image source={facebookLogo} style={S.FLogo} />
            </S.FacebookButton>
          </TouchableWithoutFeedback>

          {appleAuthAvailable && (
            <TouchableWithoutFeedback onPress={onApple} disabled={isSignedIn}>
              <S.AppleButton>
                <Image source={appleLogo} />
              </S.AppleButton>
            </TouchableWithoutFeedback>
          )}
        </S.IconRow>
      </S.StyledScrollView>

      <WavyHeader />
    </S.Container>
  );
}
