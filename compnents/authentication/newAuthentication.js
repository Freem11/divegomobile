import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
  Keyboard,
} from "react-native";
import carrouselData from "./carrouselData";
import CreateAccountPage from "./signupPage";
import LandingPage from "./landingPage";
import LoginPage from "./loginPage";
import ForgotPage from "./forgotPasswordPage";
import { colors } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PAGES = { SIGN_UP: 0, LANDING: 1, LOGIN: 2, FORGOT_PASSWORD: 3 };

export default function Authentication() {
  const scrollViewRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(PAGES.LOGIN);
  const [loginFail, setLoginFail] = useState(null);
  const [regFail, setRegFail] = useState(null);
  const [emailSent, setEmailSent] = useState(null);

  useEffect(() => {
    Keyboard.dismiss()
    carrouselIndex === PAGES.LOGIN && setPage(PAGES.LOGIN);
    carrouselIndex === PAGES.SIGN_UP && setPage(PAGES.SIGN_UP);
    carrouselIndex === PAGES.LANDING && setPage(PAGES.LANDING);
    carrouselIndex === PAGES.FORGOT_PASSWORD && setPage(PAGES.FORGOT_PASSWORD);
  }, [carrouselIndex]);

  const setPage = (pageIndex) => {
    setLoginFail(null);
    setRegFail(null);
    setEmailSent(null);
    setCarrouselIndex(pageIndex);
    scrollViewRef.current?.scrollTo({
      x: windowWidth * pageIndex,
      animated: true,
    });
  };

  // TODO: refactor to use screen data / i18n

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={false}
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.pageContainter}
      >
        <View style={styles.pageContent}>
          <CreateAccountPage
            title={carrouselData[PAGES.SIGN_UP].title}
            emailPlaceholder={carrouselData[PAGES.SIGN_UP].emailPlaceholder}
            passwordPlaceholder={carrouselData[PAGES.SIGN_UP].passwordPlaceholder}
            namePlaceholder={carrouselData[PAGES.SIGN_UP].namePlaceholder}
            buttonText={carrouselData[PAGES.SIGN_UP].buttonText}
            promptText={carrouselData[PAGES.SIGN_UP].promptText}
            promptLinkText={carrouselData[PAGES.SIGN_UP].promptLinkText}
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            regFail={regFail}
            setRegFail={setRegFail}
          />
        </View>

        <View style={styles.pageContent}>
          <LandingPage
            title={carrouselData[PAGES.LANDING].title}
            loginButton={carrouselData[PAGES.LANDING].buttonOneText}
            registerButton={carrouselData[PAGES.LANDING].buttonTwoText}
            content={carrouselData[PAGES.LANDING].content}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
          />
        </View>

        <View style={styles.pageContent}>

          <LoginPage
            title={carrouselData[PAGES.LOGIN].title}
            promptText={carrouselData[PAGES.LOGIN].promptText}
            buttonText={carrouselData[PAGES.LOGIN].buttonText}
            emailPlaceholder={carrouselData[PAGES.LOGIN].emailPlaceholder}
            passwordPlaceholder={carrouselData[PAGES.LOGIN].passwordPlaceholder}
            promptLinkText={carrouselData[PAGES.LOGIN].promptLinkText}
            forgotPromt={carrouselData[PAGES.LOGIN].forgotPromt}
            loginFail={loginFail}
            setLoginFail={setLoginFail}
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
            moveToForgotPasswordPage={() => setPage(PAGES.FORGOT_PASSWORD)}
          />

        </View>

        <View style={styles.pageContent}>

          <ForgotPage
            title={carrouselData[PAGES.FORGOT_PASSWORD].title}
            buttonText={carrouselData[PAGES.FORGOT_PASSWORD].buttonText}
            emailPlaceholder={carrouselData[PAGES.FORGOT_PASSWORD].emailPlaceholder}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            setEmailSent={setEmailSent}
            emailSent={emailSent}
          />

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.themeWhite,
  },
  pageContainter: {
    alignItems: "center",
    justifyContent: "center",
  },
  pageContent: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
