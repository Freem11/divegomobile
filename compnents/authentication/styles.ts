import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { colors } from "../styles";

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("screen").height;

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${colors.neutralGrey};
`;

export const pageContainer = {
  alignItems: "center",
  justifyContent: "center",
};

export const PageContent = styled.View`
  z-index: 6;
  width: ${windowWidth}px;
  height: ${windowHeight}px;
  justify-content: center;
  align-items: center;
  backgounrd-color: green;
`;

export const PageContentParallax = styled.View`
  z-index: -1;
  width: ${windowWidth}px;
  backgounrd-color: green;
`;