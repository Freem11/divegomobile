import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { colors } from "../../styles";

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${colors.themeWhite};
`;

export const PageContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const PageContent = styled.View`
  width: ${windowWidth}px;
  height: ${windowHeight}px;
  justify-content: center;
  align-items: center;
`;
