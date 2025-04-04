import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
} from "react-native";
import carrouselData from "./carrouselData";
import CreateAccountPage from "./signupPage/index_old";
import LandingPage from "./landingPage";
import LoginPage from "./loginPage";
import ForgotPage from './forgotPassword';
import {
  colors,
} from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PAGES = { SIGN_UP: 0, LANDING: 1, LOGIN: 2, FORGOT_PASSWORD: 3 }

export default function Authentication() {
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(1);
  const [loginFail, setLoginFail] = useState(null);
  const [regFail, setRegFail] = useState(null);
  const [emailSent, setEmailSent] = useState(null);

  const setPage = (pageIndex) => {
    setLoginFail(null);
    setRegFail(null);
    setEmailSent(null);
    setCarrouselIndex(pageIndex);
    carrouselRef.current?.scrollToIndex({ index: pageIndex });
  }

  useEffect(() => {
    carrouselIndex === PAGES.LOGIN && setPage(PAGES.LOGIN);
    carrouselIndex === PAGES.SIGN_UP && setPage(PAGES.SIGN_UP);
    carrouselIndex === PAGES.LANDING && setPage(PAGES.LANDING);
    carrouselIndex === PAGES.FORGOT_PASSWORD && setPage(PAGES.FORGOT_PASSWORD);
  }, [carrouselIndex]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.page}
        contentContainerStyle={styles.pageContainter}
        ref={carrouselRef}
        horizontal
        pagingEnabled
        onScrollToIndexFailed={(carrouselIndex) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 1));
          wait.then(() => {
            setCarrouselIndex(1);
            const scrollToIndex = carrouselIndex;
            carrouselRef.current?.scrollToIndex(scrollToIndex);
          });
        }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum
        keyExtractor={(item) => item.page}
        data={carrouselData}
        renderItem={({ item }) => (
          <View key={item.page} style={styles.pageContent}>
            {item.page === 1 ? (
              <CreateAccountPage
                title={item.title}
                emailPlaceholder={item.emailPlaceholder}
                passwordPlaceholder={item.passwordPlaceholder}
                namePlaceholder={item.namePlaceholder}
                buttonText={item.buttonText}
                promptText={item.promptText}
                promptLinkText={item.promptLinkText}
                moveToLandingPage={() => setPage(PAGES.LANDING)}
                moveToLoginPage={() => setPage(PAGES.LOGIN)}
                regFail={regFail}
                setRegFail={setRegFail}
              />
            ) : null}

            {item.page === 2 ? (
              <LandingPage
                title={item.title}
                loginButton={item.buttonOneText}
                registerButton={item.buttonTwoText}
                content={item.content}
                moveToLoginPage={() => setPage(PAGES.LOGIN)}
                moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
              />
            ) : null}

            {item.page === 3 ? (
              <LoginPage
                title={item.title}
                emailPlaceholder={item.emailPlaceholder}
                passwordPlaceholder={item.passwordPlaceholder}
                buttonText={item.buttonText}
                promptText={item.promptText}
                promptLinkText={item.promptLinkText}
                loginFail={loginFail}
                setLoginFail={setLoginFail}
                forgotPromt={item.forgotPromt}
                moveToLandingPage={() => setPage(PAGES.LANDING)}
                moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
                moveToForgotPasswordPage={() => setPage(PAGES.FORGOT_PASSWORD)}
              />
            ) : null}
            {item.page === 4 ? (
              <ForgotPage
                title={item.title}
                emailPlaceholder={item.emailPlaceholder}
                buttonText={item.buttonText}
                moveToLoginPage={() => setPage(PAGES.LOGIN)}
                setEmailSent={setEmailSent}
                emailSent={emailSent}
              />
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    height: "100%",
    width: windowWidth,
    backgroundColor: colors.themeWhite,
    zIndex: 26,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    width: "100%",
    height: "100%",
    // backgroundColor: "pink"
  },
  pageContainter: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink"
  },
  pageContent: {
    // backgroundColor: "green",
    height: windowHeight,
    width: windowWidth,
    alignItems: "center",
  },
});
