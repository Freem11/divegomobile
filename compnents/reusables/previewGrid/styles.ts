import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { activeFonts, colors, fontSizes } from "../../styles";

export const Wrapper = styled.View`
  align-self: center;
`;

export const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
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
  gap: ${moderateScale(6)}px;
  border: 1px dashed ${colors.primaryBlue};
`;

export const AddSightingText = styled.Text`
  display: flex;
  flex-direction: column;
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.XSmall)}px;
`;