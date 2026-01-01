import React from "react";
import {
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import Svg, { Path } from "react-native-svg";
import Video from "react-native-video";

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

const CustomWave = () => (
  <Path
    fill="white"
    d="M0,350
       C250,50 250,50 500,250
       S750,450 1000,150
       V500 H0 Z"
  />
);

export default function LandingPageView(props: IProps) {
  const { t } = useTranslation();
  const facebookAuthAvailable = false;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <S.Container>

        {/* Background Video Section */}
        <S.BackgroundContainer>
          <Video
            source={{ uri: "https://pub-9114df4c0fd044d0806a9e8819aa3212.r2.dev/HeroVideo2026-1.mov" }}
            style={styles.backgroundVideo}
            muted={true}
            repeat={true}
            resizeMode="cover"
            rate={1.0}
            ignoreSilentSwitch={"obey"}
            playWhenInactive={false}
            playInBackground={false}
          />
        </S.BackgroundContainer>

        <S.StaticContentWrapper>
          <S.TopTransparentSection>
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 800"
              preserveAspectRatio="none"
              style={{ position: "absolute", bottom: 0 }}
            >
              <CustomWave />
            </Svg>
          </S.TopTransparentSection>

          <S.BottomOpaqueSection>
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
          </S.BottomOpaqueSection>
        </S.StaticContentWrapper>
      </S.Container>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});