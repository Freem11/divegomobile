import {
  StyleSheet, Dimensions,
} from "react-native";
import { scale, moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../styles";
import styled from "styled-components/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const screenHeight = Dimensions.get("screen").height;

export const FloatingImage = styled.Image({
  position: 'absolute',
  bottom: moderateScale(95),
  right: moderateScale(-50),
  zIndex: 1,
  height: moderateScale(200),
  width: moderateScale(300),
  pointerEvents: "none"
});

export const Container = styled.View({
  flex: 1
});

export const ScreenContainer = styled.View({
  flex: 1
});

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    height: screenHeight,
    width: windowWidth,
    backgroundColor: colors.primaryBlue,
    zIndex: 26,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    width: "100%",
    height: windowHeight / 2,
    // marginTop: "10%",
    marginBottom: "2%",
    // backgroundColor: "lightblue",
  },
  pageContainter: {
    // alignItems: "center",
    justifyContent: "center",
  },
  pageContent: {
    backgroundColor: colors.primaryBlue,
    height: windowHeight,
    width: windowWidth,
    alignItems: "center",
    justifyContent: "center"
  },
  scrollViewBox: {
    height: windowHeight / 2.5,
    // backgroundColor: 'pink'
  },
  scrollView: {
    // backgroundColor: 'purple',
  },
  title: {
    fontFamily: activeFonts.Regular,
    fontSize: moderateScale(fontSizes.Header),
    paddingHorizontal: moderateScale(30),
    marginTop: windowHeight > 700 && windowWidth < 700 ? "-35%" : "-35%",
    marginBottom: moderateScale(10),
    width: windowWidth,
    color: colors.themeWhite,
    textAlign: "center",
  },
  content: {
    paddingTop: moderateScale(5),
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(fontSizes.StandardText),
    marginTop: moderateScale(15),
    width: windowWidth * 0.8,
    color: colors.themeWhite,
    textAlign: "center",
  },
  imageBox: {
    position: "absolute",
    bottom: moderateScale(0),
    right: moderateScale(0),
    pointerEvents: "none"
  },
  image: {
    position: "absolute",
    bottom: moderateScale(95),
    right: moderateScale(-50),
    height: moderateScale(200),
    width: moderateScale(300),
    transform: [{ rotate: "3deg" }],
  },
  buttonBox: {
    // backgroundColor: 'pink',
    width: windowWidth * 0.85,
    height: moderateScale(70),
    position: "absolute",
    bottom: scale(20),
    borderTopWidth: moderateScale(1),
    borderTopColor: "lightgray",
    paddingTop: moderateScale(5),
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonTwo: {
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: colors.themeWhite,
  },
  buttonTwoText: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(20),
    color: colors.themeWhite,
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
  buttonOne: {
    borderRadius: moderateScale(10),
    backgroundColor: colors.themeWhite,
  },
  buttonOneText: {
    fontFamily: activeFonts.Medium,
    fontSize: moderateScale(20),
    color: colors.primaryBlue,
    padding: moderateScale(10),
    paddingRight: moderateScale(30),
    paddingLeft: moderateScale(30),
  },
  erroMsg: {
    margin: moderateScale(5),
    marginLeft: screenHeight < 800 ? moderateScale(-110) : 0,
    width: screenHeight < 800 ? "50%" : "auto",
    textAlign: "center",
    padding: moderateScale(7),
    paddingHorizontal: moderateScale(10),
    color: "pink",
    fontFamily: activeFonts.Thin,
    fontSize: scale(14),
    borderStyle: "dashed",
    borderRadius: moderateScale(10),
    borderColor: "darkblue",
    borderWidth: 1,
    marginTop: moderateScale(40),
  },
  inputBox: {
    width: "70%",
    marginTop: "-10%",
  },
});

export default styles;