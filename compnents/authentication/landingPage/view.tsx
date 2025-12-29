import React from "react";
import { Image, TouchableWithoutFeedback } from "react-native";
import { useTranslation } from "react-i18next";

import WavyHeader from "../../wavyHeader";
import googleLogo from "../../png/loginIcons/google.png";
import facebookLogo from "../../png/loginIcons/facebook.png";
import appleLogo from "../../png/loginIcons/apple.png";
import Button from "../../reusables/button";

import * as S from "./styles";

interface IProps {
  isSignedIn: boolean;
  appleAuthAvailable: boolean;
  onLogin: () => void;
  onSignUp: () => void;
  onGoogle: () => void;
  onFacebook: () => void;
  onApple: () => void;
}

export default function LandingPageView(props: IProps) {

  const { t } = useTranslation();
  const facebookAuthAvailable = false;

  return (
    <S.Container>
      <WavyHeader />
      <S.StyledScrollView>
        <S.Header>{t("Auth.diveIn")}</S.Header>

        <S.ButtonBox>
          <S.ButtonSpacer>
            <Button
              onPress={props.onLogin}
              alt={false}
              size="large"
              title={t("Common.login")}
            />
          </S.ButtonSpacer>
          <S.ButtonSpacer>
            <Button
              onPress={props.onSignUp}
              alt={true}
              size="large"
              title={t("Common.registerAccount")}
            />
          </S.ButtonSpacer>
        </S.ButtonBox>

        <S.SocialText>{t("Auth.socialText")}</S.SocialText>

        <S.IconRow>
          <TouchableWithoutFeedback onPress={props.onGoogle} disabled={props.isSignedIn}>
            <S.GoogleButton>
              <Image source={googleLogo} style={S.GLogo} />
            </S.GoogleButton>
          </TouchableWithoutFeedback>

          {facebookAuthAvailable && (
            <TouchableWithoutFeedback onPress={props.onFacebook} disabled={props.isSignedIn}>
              <S.FacebookButton>
                <Image source={facebookLogo} style={S.FLogo} />
              </S.FacebookButton>
            </TouchableWithoutFeedback>
          )}

          {props.appleAuthAvailable && (
            <TouchableWithoutFeedback onPress={props.onApple} disabled={props.isSignedIn}>
              <S.AppleButton>
                <Image source={appleLogo} style={S.ALogo} />
              </S.AppleButton>
            </TouchableWithoutFeedback>
          )}
        </S.IconRow>
      </S.StyledScrollView>
    </S.Container>
  );
}
