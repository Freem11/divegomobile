import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../../styles";

interface ExplainerStyleProps {
  size: number;
}

export const Explainer = styled.TouchableOpacity<ExplainerStyleProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${colors.lighterBlue};
  height: ${props => moderateScale(props.size)}px;
  width: ${props => moderateScale(props.size)}px;
  border-radius: ${props => moderateScale(props.size / 2)}px;
  
  margin-left: ${moderateScale(8)}px;
`;
