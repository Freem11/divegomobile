import React, { useEffect, useRef, useState } from "react";
import { Keyboard, ScrollView } from "react-native";
import * as S from "./styles";
import carrouselData from "./utils/carrouselData";
import CreateAccountPage from "./signupPage";
import LandingPage from "./landingPage";
import LoginPage from "./loginPage";
import ForgotPage from "./forgotPasswordPage";

const PAGES = { SIGN_UP: 0, LANDING: 1, LOGIN: 2, FORGOT_PASSWORD: 3 };

export default function Authentication() {
  const scrollViewRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(PAGES.LANDING);
  const [loginFail, setLoginFail] = useState(null);
  const [regFail, setRegFail] = useState(null);
  const [emailSent, setEmailSent] = useState(null);

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
      x: S.windowWidth * pageIndex,
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
            {...carrouselData[PAGES.SIGN_UP]}
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            regFail={regFail}
            setRegFail={setRegFail}
          />
        </S.PageContent>

        <S.PageContent>
          <LandingPage
            {...carrouselData[PAGES.LANDING]}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
          />
        </S.PageContent>

        <S.PageContent>
          <LoginPage
            {...carrouselData[PAGES.LOGIN]}
            loginFail={loginFail}
            setLoginFail={setLoginFail}
            moveToLandingPage={() => setPage(PAGES.LANDING)}
            moveToSignUpPage={() => setPage(PAGES.SIGN_UP)}
            moveToForgotPasswordPage={() => setPage(PAGES.FORGOT_PASSWORD)}
          />
        </S.PageContent>

        <S.PageContent>
          <ForgotPage
            {...carrouselData[PAGES.FORGOT_PASSWORD]}
            setEmailSent={setEmailSent}
            emailSent={emailSent}
            moveToLoginPage={() => setPage(PAGES.LOGIN)}
          />
        </S.PageContent>
      </ScrollView>
    </S.Wrapper>
  );
}
