import React from "react";
import {
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import WavyHeader from "../../wavyHeader";
import * as S from "./styles";
import googleLogo from "../../png/loginIcons/google.png";
import facebookLogo from "../../png/loginIcons/facebook.png";
import appleLogo from "../../png/loginIcons/apple.png";

export default function LandingPageView({
  title,
  loginButton,
  registerButton,
  content,
  isSignedIn,
  appleAuthAvailable,
  onLogin,
  onSignUp,
  onGoogle,
  onFacebook,
  onApple,
}) {
  return (
    <S.Container>
      <ScrollView
        scrollEnabled={false}
        style={S.scrollStyle}
        contentContainerStyle={S.scrollContent}
      >
        <S.Header>{title}</S.Header>

        <TouchableWithoutFeedback onPress={onLogin}>
          <S.LoginButton>
            <S.LoginText>{loginButton}</S.LoginText>
          </S.LoginButton>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={onSignUp}>
          <S.RegisterButton>
            <S.RegisterText>{registerButton}</S.RegisterText>
          </S.RegisterButton>
        </TouchableWithoutFeedback>

        <S.SocialText>{content}</S.SocialText>
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
                <Image source={appleLogo} style={S.Icon} />
              </S.AppleButton>
            </TouchableWithoutFeedback>
          )}
        </S.IconRow>
      </ScrollView>
      <WavyHeader customStyles={S.Curve} />
    </S.Container>
  );
}
