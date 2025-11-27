import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../../styles";

export const Explainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${colors.lighterBlue};
  align-items: center;
  border-radius: ${moderateScale(30)}px;
  height: ${moderateScale(30)};
  width: ${moderateScale(30)};
  margin-left: ${moderateScale(8)}
`;
