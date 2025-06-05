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

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get('window').width;

export const ContentContainer = styled.View`
  width: ${windowWidth}px;
  margin-top: -5%;
  align-items: center;
  z-index: 1;
  backgounrd-color: green;
`;

export const InputGroupContainer = styled.View`
  margin-bottom: ${windowHeight / 70}px;
  width: ${windowWidth * 0.75}px;
`;

export const Header = styled.Text`
  margin-left: 15%;
  margin-bottom: 5%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.themeBlack};
  align-self: flex-start;
`;

export const SocialText = styled.Text`
  z-index: 10;
  margin-top:2%;
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.ThinItalic};
  color: ${colors.themeBlack};
`;

export const ButtonBox = styled.View`
  padding-top: ${moderateScale(0)}px;
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
  margin-top: 5%;
  margin-bottom: 10%;
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
