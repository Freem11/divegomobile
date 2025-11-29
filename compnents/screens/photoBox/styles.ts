import styled from "styled-components/native";

import { colors } from "../../styles";

export const ContentContainer = styled.View`
    flex: 1;
    zIndex: 5;
    background-color: ${colors.themeBlack};
`;

export const BackButtonWrapper = styled.View`
  position: absolute; 
  z-index: 50;
  top: 60px;
  left: 0;
  width: 100%;
  padding-horizontal: 1%;
  align-items: flex-start;
`;
