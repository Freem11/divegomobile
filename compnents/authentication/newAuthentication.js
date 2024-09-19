import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
} from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import carrouselData from "./carrouselData";
import CreateAccountPage from "./createAccountPage";
import LandingPage from "./landingPage";
import LoginPage from "./loginPage";
import {
  activeFonts,
  colors,
} from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Authentication() {
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(1);
  const [loginFail, setLoginFail] = useState(null);
  const [regFail, setRegFail] = useState(null);

  const moveToLoginPage = () => {
    setLoginFail(null);
    setRegFail(null);
    setCarrouselIndex(2);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  const moveToLandingPage = () => {
    setLoginFail(null);
    setRegFail(null);
    setCarrouselIndex(1);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  const moveToSignUpPage = () => {
    setLoginFail(null);
    setRegFail(null);
    setCarrouselIndex(0);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  useEffect(() => {
    carrouselIndex === 2 ? moveToLandingPage() : null
  },[])


  useEffect(() => {
    carrouselIndex === 0 ? moveToSignUpPage() : null
    carrouselIndex === 1 ? moveToLandingPage() : null
    carrouselIndex === 2 ? moveToLoginPage() : null

  },[carrouselIndex])

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
                moveToLandingPage={moveToLandingPage}
                moveToLoginPage={moveToLoginPage}
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
                moveToLoginPage={moveToLoginPage}
                moveToSignUpPage={moveToSignUpPage}
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
                moveToLandingPage={moveToLandingPage}
                moveToSignUpPage={moveToSignUpPage}
                loginFail={loginFail} 
                setLoginFail={setLoginFail}
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

  title: {
    fontFamily: activeFonts.Black,
    fontSize: moderateScale(32),
    paddingHorizontal: moderateScale(30),
    marginTop: windowHeight > 700 && windowWidth < 700 ? scale(150) : scale(60),
    marginBottom: moderateScale(10),
    width: windowWidth,
    color: colors.themeBlack,
    textAlign: "center",
  },
  erroMsg: {
    margin: moderateScale(5),
    marginLeft: windowHeight < 800 ? moderateScale(-110) : 0,
    width: windowHeight < 800 ? "50%" : "auto",
    textAlign: "center",
    padding: moderateScale(7),
    paddingHorizontal: moderateScale(10),
    color: "pink",
    fontFamily: "Itim_400Regular",
    fontSize: scale(14),
    borderStyle: "dashed",
    borderRadius: moderateScale(10),
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: moderateScale(40),
  },
});
