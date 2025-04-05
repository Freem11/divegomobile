import { StyleSheet, View, Text, Dimensions, Image, ImageBackground, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";

export const colors = {
  primaryBlue: '#0073E6',
  secondaryYellow: '#fdc500',
  themeWhite: '#ffffff',
  themeBlack: '#00171f',
  neutralGrey: '#A9A9A9'
}

export const fontSizes = {
  Header: 34,
  SubHeading: 24,
  StandardText: 18,
  SmallText: 14
}

export const activeFonts = Platform.OS === "android" ? {
  Black: "RobotoBlack",
  BlackItalic: "RobotoBlackItalic",
  Bold: "RobotoBold",
  BoldItalic: "RobotoBoldItalic",
  Italic: "RobotoItalic",
  Light: "RobotoLight",
  LightItalic: "RobotoLightItalic",
  Medium: "RobotoMedium",
  MediumItalic: "RobotoMediumItalic",
  Regular: "RobotoRegular",
  Thin: "RobotoThin",
  ThinItalic: "RobotoThinItalic",
} : {
  Black: "SFBlack",
  BlackItalic: "SFBlackItalic",
  Bold: "SFBold",
  BoldItalic: "SFBoldItalic",
  Italic: "SFItalic",
  Light: "SFLight",
  LightItalic: "SFLightItalic",
  Medium: "SFMedium",
  MediumItalic: "SFMediumItalic",
  Regular: "SFRegular",
  Thin: "SFThin",
  ThinItalic: "SFThinItalic",
}

export const primaryButton = {
  backgroundColor: colors.primaryBlue,
  width: moderateScale(240),
  height: moderateScale(50),
  color: colors.themeWhite,
  borderRadius: moderateScale(25),
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: "#2d2d2d",
  shadowOffset: {
    width: moderateScale(1),
    height: moderateScale(1),
  },
  shadowOpacity: 0.5,
  shadowRadius: moderateScale(2),

  elevation: 10,
}

export const buttonText = {
  color: colors.themeWhite,
  fontFamily: activeFonts.Regular,
  fontSize: moderateScale(fontSizes.StandardText)
}

export const primaryButtonAlt = {
  backgroundColor: colors.themeWhite,
  width: moderateScale(238),
  height: moderateScale(48),
  color: colors.primaryBlue,
  borderColor: colors.primaryBlue,
  borderWidth: moderateScale(1),
  borderRadius: moderateScale(25),
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: "#2d2d2d",
  shadowOffset: {
    width: moderateScale(1),
    height: moderateScale(1),
  },
  shadowOpacity: 0.5,
  shadowRadius: moderateScale(2),

  elevation: 10,
}

export const buttonTextAlt = {
  color: colors.primaryBlue,
  fontFamily: activeFonts.Regular,
  fontSize: moderateScale(fontSizes.StandardText),
}

export const authenicationButton = {
  backgroundColor: colors.primaryBlue,
  width: moderateScale(130),
  height: moderateScale(45),
  color: colors.themeWhite,
  borderRadius: moderateScale(25),
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: "#2d2d2d",
  shadowOffset: {
    width: moderateScale(1),
    height: moderateScale(1),
  },
  shadowOpacity: 0.5,
  shadowRadius: moderateScale(2),

  elevation: 10,
}

export const screenSecondaryButton = {
  backgroundColor: colors.themeWhite,
  width: moderateScale(130),
  height: moderateScale(45),
  color: colors.primaryBlue,
  borderColor: colors.primaryBlue,
  borderWidth: moderateScale(1),
  borderRadius: moderateScale(25),
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: "#2d2d2d",
  shadowOffset: {
    width: moderateScale(1),
    height: moderateScale(1),
  },
  shadowOpacity: 0.5,
  shadowRadius: moderateScale(2),

  elevation: 10,
}

// export const roundButton = {
//   borderColor: "darkgrey",
//   borderWidth: moderateScale(1),
//   borderRadius: moderateScale(30),
//   width: moderateScale(55),
//   height: moderateScale(55),
//   color: colors.themeWhite,
//   alignItems: 'center',
//   justifyContent: 'center',
//   shadowColor: "#2d2d2d",
//   shadowOffset: {
//     width: moderateScale(3),
//     height: moderateScale(1),
//   },
//   shadowOpacity: 0.5,
//   shadowRadius: moderateScale(2),

//   elevation: 10,
// }