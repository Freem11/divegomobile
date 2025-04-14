import React from "react";
import { Image, TouchableWithoutFeedback, } from "react-native";
import WavyHeader from "../../wavyHeader";
import * as S from "./styles";
import googleLogo from "../../png/loginIcons/google.png";
import facebookLogo from "../../png/loginIcons/facebook.png";
import appleLogo from "../../png/loginIcons/apple.png";
import { useTranslation } from "react-i18next";
import Button from "../../reusables/button";

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

  const { t: tAuth } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");

  return (
    <S.Container>
      <S.StyledScrollView>
        <S.Header>{tAuth("landing.title")}</S.Header>

        <S.ButtonBox>
          <S.ButtonSpacer>
            <Button 
                onPress={onLogin} 
                alt={false} 
                size='large'
                title={tCommon("login")} 
                />
          </S.ButtonSpacer>
          <S.ButtonSpacer>
            <Button 
                onPress={onSignUp} 
                alt={true} 
                size='large'
                title={tCommon("registerAccount")} 
                />
          </S.ButtonSpacer>
        </S.ButtonBox>

        <S.SocialText>{tAuth("landing.socialText")}</S.SocialText>

        <S.IconRow>

          <TouchableWithoutFeedback onPress={onGoogle} disabled={isSignedIn}>
            <S.GoogleButton>
              <Image source={googleLogo} style={S.GLogo} />
            </S.GoogleButton>
          </TouchableWithoutFeedback>

          {/* <TouchableWithoutFeedback onPress={onFacebook} disabled={isSignedIn}>
            <S.FacebookButton>
              <Image source={facebookLogo} style={S.FLogo} />
            </S.FacebookButton>
          </TouchableWithoutFeedback> */}

          {appleAuthAvailable && (
            <TouchableWithoutFeedback onPress={onApple} disabled={isSignedIn}>
              <S.AppleButton>
                <Image source={appleLogo} style={S.ALogo} />
              </S.AppleButton>
            </TouchableWithoutFeedback>
          )}
        </S.IconRow>
      </S.StyledScrollView>

      <WavyHeader />
    </S.Container>
  );
}
