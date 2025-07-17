import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, fontSizes, activeFonts } from "../../styles";

export const LabelWrapper = styled.View`
  width: 100%;
  margin-bottom: ${moderateScale(20)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SectionFooterWrapper = styled.View`
  width: 100%;
  margin-top: ${moderateScale(10)}px;
  padding: 0 ${moderateScale(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TotalCount = styled.Text`
  color: ${colors.darkGrey};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const ViewMoreButtonText = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const ViewMoreButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: -${moderateScale(5)}px;
`;