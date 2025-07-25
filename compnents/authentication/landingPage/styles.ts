import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import {
  activeFonts,
  colors,
  fontSizes,
  primaryButton,
  primaryButtonAlt,
  buttonText,
  buttonTextAlt,
} from "../../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const StyledScrollView = styled.ScrollView.attrs(() => ({
  scrollEnabled: false,
  contentContainerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}))`
  z-index: 15;
  position: absolute;
  top: 0;
  left: 0;
  height: ${windowHeight}px;
  width: 100%;
`;

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

export const scrollStyle = {
  zIndex: 15,
  position: "absolute",
  top: 0,
  left: 0,
  height: windowHeight,
  width: "100%",
};

export const scrollContent = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};

export const Header = styled.Text`
  z-index: 10;
  margin-top: ${windowWidth > 600
    ? windowHeight / 2.5
    : moderateScale(windowHeight / 3.2)}px;
  margin-right: ${windowWidth / 3}px;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.themeBlack};
`;

export const SocialText = styled.Text`
  z-index: 10;
  margin-top: ${windowHeight / 20}px;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.ThinItalic};
  color: ${colors.themeBlack};
`;

export const ButtonBox = styled.View`
  padding-top: ${moderateScale(20)}px;
`;

export const ButtonSpacer = styled.View`
  padding-vertical: ${moderateScale(10)}px;
`;

export const LoginButton = styled.View`
  ${primaryButton};
  margin-top: ${windowHeight / 20}px;
`;

export const RegisterButton = styled.View`
  ${primaryButtonAlt};
  margin-top: ${windowHeight / 50}px;
`;

export const LoginText = styled.Text`
  ${buttonText};
`;

export const RegisterText = styled.Text`
  ${buttonTextAlt};
`;

export const IconRow = styled.View`
  width: ${moderateScale(200)}px;
  margin-top: ${windowHeight / 30}px;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

const sharedIconStyle = `
  border-radius: ${moderateScale(25)}px;
  height: ${moderateScale(48)}px;
  width: ${moderateScale(48)}px;
  align-items: center;
  justify-content: center;
  elevation: 10;
  shadow-offset: 1px 1px;
  shadow-opacity: 1;
  shadow-radius: ${moderateScale(2)}px;
`;

export const GoogleButton = styled.View`
  background-color: ${colors.themeBlack};
  border-radius: ${moderateScale(25)}px;
  height: ${moderateScale(48)}px;
  width: ${moderateScale(50)}px;
  align-items: center;
  justify-content: center;
   ${sharedIconStyle}
`;

export const FacebookButton = styled.View`
  background-color: #1877f2;
  ${sharedIconStyle};
`;

export const AppleButton = styled.View`
  background-color: ${colors.themeWhite};;
  margin-left: ${moderateScale(6)}px;
  ${sharedIconStyle};
`;

export const GLogo = {
  height: moderateScale(44),
  width: moderateScale(44),
};

export const FLogo = {
  marginBottom: moderateScale(4),
  height: moderateScale(45),
  width: moderateScale(45),
};

export const ALogo = {
  height: moderateScale(50),
  width: moderateScale(50),
};


export const Icon = {
  height: moderateScale(45),
  width: moderateScale(45),
  resizeMode: "contain",
};

export const Curve = {
  position: "absolute",
  bottom: 0,
  width: Dimensions.get("window").width,
};
