import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import Svg, { Path } from "react-native-svg";

import googleLogo from "../../png/loginIcons/google.png";
import facebookLogo from "../../png/loginIcons/facebook.png";
import appleLogo from "../../png/loginIcons/apple.png";
import Button from "../../reusables/button";

import * as S from "./styles";

// Get screen dimensions for the FlatList items
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface IProps {
  isSignedIn: boolean;
  appleAuthAvailable: boolean;
  onLogin: () => void;
  onSignUp: () => void;
  onGoogle: () => void;
  onFacebook: () => void;
  onApple: () => void;
}

// Define your image array here
const BACKGROUND_IMAGES = [
  require("../../png/SeaHorse.jpg"),
  require("../../png/SeaTurt.jpg"),
  require("../../png/SeaLion2.jpg"),
  require("../../png/Octos.jpg"),
  require("../../png/Manta.jpg"),
];

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

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;

      if (nextIndex >= BACKGROUND_IMAGES.length) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <S.Container>

        {/* Animated Background Section */}
        <S.BackgroundContainer>
          <FlatList
            ref={flatListRef}
            data={BACKGROUND_IMAGES}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false} // Prevents user interaction from fighting the timer
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <Image
                source={item}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 2 }}
                resizeMode="cover"
              />
            )}
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