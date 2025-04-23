import styled from "styled-components/native";
import { Dimensions, Platform } from "react-native";
import { colors } from "../../styles";import { moderateScale } from "react-native-size-matters";
;

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const Wrapper = styled.View`
  width: 100%;
  background-color: ${colors.themeWhite};
`;

export const PageContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const PageContent = styled.View`
  width: ${windowWidth}px;
  height: ${Platform.OS === "ios" ? windowHeight : windowHeight-moderateScale(35)}px;
  justify-content: center;
  align-items: center;
`;
