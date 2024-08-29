import React, { useRef, useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import carrouselData from "./carrouselData";
import LandingPage from "./landingPage";
import LoginPage from "./loginPage";
import {
  activeFonts,
  colors,
  primaryButton,
  primaryButtonAlt,
  buttonText,
  buttonTextAlt,
} from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Authentication() {
  const carrouselRef = useRef(null);
  const [carrouselIndex, setCarrouselIndex] = useState(1);

  const moveToLoginPage = () => {
    setCarrouselIndex(2);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  const moveToSignUpPage = () => {
    setCarrouselIndex(0);
    const scrollToIndex = carrouselIndex;
    carrouselRef.current?.scrollToIndex({ index: scrollToIndex });
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.page}
        contentContainerStyle={styles.pageContainter}
        ref={carrouselRef}
        horizontal
        pagingEnabled
        // scrollEnabled={false}
        initialScrollIndex={1}
        onScrollToIndexFailed={(carrouselIndex) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
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
            {item.page === 1 ? <Text>Empty</Text> : null}

            {item.page === 2 ? (
              <LandingPage
                title={item.title}
                loginButton={item.buttonOneText}
                registerButton={item.buttonTwoText}
                content={item.content}
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
    height: '100%',
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
