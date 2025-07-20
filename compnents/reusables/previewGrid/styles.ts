import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors } from "../../styles";

export const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 20px;
`;

export const Item = styled.View`
  overflow: hidden;
  border-radius: ${moderateScale(8)}px;
`;

export const AddSightingButton = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: ${moderateScale(8)}px;
  align-items: center;
  justify-content: center;
  gap: ${moderateScale(6)};
  border: 1px dashed ${colors.primaryBlue};
`;

export const AddSightingText = styled.Text`
  display: flex;
  flex-direction: column;
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
`;