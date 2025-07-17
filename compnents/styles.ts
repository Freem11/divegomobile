import { Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";

export const colors = {
  primaryBlue: "#0073E6",
  headersBlue: "#678FB7",
  secondaryYellow: "#fdc500",
  themeWhite: "#ffffff",
  themeBlack: "#00171f",
  themeRed: "#E63946",
  themeGreen: "#4caf50",
  lightGrey: "#e8e8e8",
  neutralGrey: "#A9A9A9",
  darkGrey: "#706b6b",
  buttonPressOverlay: "rgba(128, 128, 128, 0.25)",
  headerButtonOverlay: "rgba(0,0,0,0.4)",
  searchOverlay: "rgba(128, 128, 128, 0.6)"
}

export const fontSizes = {
  Header: 28,
  SubHeading: 20,
  StandardText: 18,
  SmallText: 16
}

export const buttonSizes = {
  micro: {
    height: 20,
    width: 20
  },
  icon: {
    height: 28,
    width: 28
  },
  headerIcon: {
    height: 36,
    width: 36
  },
  small: {
    height: 50,
    width: 50
  },
  medium: {
    height: 50,
    width: 140
  },
  large: {
    height: 50,
    width: 250
  },
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
  alignItems: "center",
  justifyContent: "center",
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
  alignItems: "center",
  justifyContent: "center",

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
  alignItems: "center",
  justifyContent: "center",
}

export const screenSecondaryButton = {
  backgroundColor: colors.themeWhite,
  width: moderateScale(130),
  height: moderateScale(45),
  color: colors.primaryBlue,
  borderColor: colors.primaryBlue,
  borderWidth: moderateScale(1),
  borderRadius: moderateScale(25),
  alignItems: "center",
  justifyContent: "center",
}