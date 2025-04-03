import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  View,
} from "react-native";
import carrouselData from "./carrouselData";
import CreateAccountPage from "./createAccountPage";
import LandingPage from "./landingPage";
import LoginPage from "./loginPage";
import ForgotPage from "./forgotPassword";
import { colors } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PAGES = { SIGN_UP: 0, LANDING: 1, LOGIN: 2, FORGOT_PASSWORD: 3 };

export default function Authentication() {
  const scrollViewRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(PAGES.LANDING);
  const [loginFail, setLoginFail] = useState(null);
  const [regFail, setRegFail] = useState(null);
  const [emailSent, setEmailSent] = useState(null);

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

  useEffect(() => {
    carrouselIndex === PAGES.LOGIN && setPage(PAGES.LOGIN);
    carrouselIndex === PAGES.SIGN_UP && setPage(PAGES.SIGN_UP);
    carrouselIndex === PAGES.LANDING && setPage(PAGES.LANDING);
    carrouselIndex === PAGES.FORGOT_PASSWORD && setPage(PAGES.FORGOT_PASSWORD);
  }, [carrouselIndex]);

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
            title={carrouselData[0].title}
            emailPlaceholder={carrouselData[0].emailPlaceholder}
            passwordPlaceholder={carrouselData[0].passwordPlaceholder}
            namePlaceholder={carrouselData[0].namePlaceholder}
            buttonText={carrouselData[0].buttonText}
            promptText={carrouselData[0].promptText}
            promptLinkText={carrouselData[0].promptLinkText}
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            regFail={regFail}
            setRegFail={setRegFail}
          />
        </View>

        <View style={styles.pageContent}>
          <LandingPage
            title={carrouselData[1].title}
            loginButton={carrouselData[1].buttonOneText}
            registerButton={carrouselData[1].buttonTwoText}
            content={carrouselData[1].content}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
          />
        </View>

        <View style={styles.pageContent}>
          <LoginPage
            title={carrouselData[2].title}
            emailPlaceholder={carrouselData[2].emailPlaceholder}
            passwordPlaceholder={carrouselData[2].passwordPlaceholder}
            buttonText={carrouselData[2].buttonText}
            promptText={carrouselData[2].promptText}
            promptLinkText={carrouselData[2].promptLinkText}
            forgotPromt={carrouselData[2].forgotPromt}
            loginFail={loginFail}
            setLoginFail={setLoginFail}
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
            moveToForgotPasswordPage={() => setPage(PAGES.FORGOT_PASSWORD)}
          />
        </View>

        <View style={styles.pageContent}>
          <ForgotPage
            title={carrouselData[3].title}
            emailPlaceholder={carrouselData[3].emailPlaceholder}
            buttonText={carrouselData[3].buttonText}
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
