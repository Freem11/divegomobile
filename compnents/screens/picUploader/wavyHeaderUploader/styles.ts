import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { buttonTextAlt, colors, primaryButtonAlt } from "../../../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const Container = styled.View`
  flex: 1;
  height: ${windowHeight}px;
  background-color: pink;
`;

export const UploaderBackground = styled.View`
  align-items: center;
  background-color: ${colors.primaryBlue};
  width: ${windowWidth}px;
  height: ${windowWidth > 600 ? "55%" : "60%"};
`;

export const ImageBackgroundStyled = styled.ImageBackground`
  background-color: ${colors.themeWhite};
  resize-mode: cover;
  width: ${windowWidth}px;
  height: ${windowWidth > 600 ? "90%" : "90%"};
  justify-content: center;
  align-items: center;
`;

export const PhotoUploadButton = styled.TouchableOpacity`
  ${primaryButtonAlt};
  flex-direction: row;
  margin-top: ${windowWidth > 600 ? "50%" : "50%"};
`;

export const PhotoUploadText = styled.Text`
  ${buttonTextAlt};
  margin-horizontal: ${moderateScale(5)}px;
`;

export const SpinnerOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

export const AddPhotoButton = styled.View`
  position: absolute;
  top: 50%;
  right: 5%;
  z-index: 10;
`;
export const CurveWrapper = styled.View`
  justify-content: flex-end;
  height: ${windowWidth > 600 ? "130%" : "150%"};
  background-color: pink;
`;
