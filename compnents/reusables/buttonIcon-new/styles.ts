import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../styles";


export const StyledTouchableHighlight = styled.TouchableHighlight`
  height: ${moderateScale(44)}px;
  width: ${moderateScale(44)}px;
  border-radius: ${moderateScale(44) / 2}px;
  background-color: ${colors.headerButtonOverlay};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconWrapper = styled.View`
  width: ${moderateScale(35)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

