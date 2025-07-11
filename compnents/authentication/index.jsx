import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Keyboard, ScrollView } from "react-native";

import * as S from "./styles";
import CreateAccountPage from "./signupPage";
import LandingPage from "./landingPage";
import LoginPage from "./loginPage";
import ForgotPage from "./forgotPasswordPage";

const PAGES = { SIGN_UP: 1, LANDING: 2, LOGIN: 3, FORGOT_PASSWORD: 4 };

export default function Authentication() {
  const scrollViewRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(null);
  const [loginFail, setLoginFail] = useState(null);
  const [regFail, setRegFail] = useState(null);
  const [emailSent, setEmailSent] = useState(null);

  if(!carrouselIndex){
    setTimeout(() => {
      setCarrouselIndex(PAGES.LANDING)
    }, 0.05);
  }

  useEffect(() => {
    Keyboard.dismiss();
    setPage(carrouselIndex);
  }, [carrouselIndex]);

  const setPage = (pageIndex) => {
    setLoginFail(null);
    setRegFail(null);
    setEmailSent(null);
    setCarrouselIndex(pageIndex);
    scrollViewRef.current?.scrollTo({
      x: S.windowWidth * (pageIndex-1),
      animated: true,
    });
  };



  return (
    <S.Wrapper>
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={false}
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={S.pageContainer}
      >
        <S.PageContent>
          <CreateAccountPage
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            regFail={regFail}
            setRegFail={setRegFail}
          />
        </S.PageContent>

        <S.PageContent>
          <LandingPage
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
          />
        </S.PageContent>

        <S.PageContent>
          <LoginPage
            loginFail={loginFail}
            setLoginFail={setLoginFail}
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
            moveToForgotPasswordPage={() => setPage(PAGES.FORGOT_PASSWORD)}
          />
        </S.PageContent>

        <S.PageContent>
          <ForgotPage
            setEmailSent={setEmailSent}
            emailSent={emailSent}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
          />
        </S.PageContent>
      </ScrollView>
    </S.Wrapper>
  );
}
