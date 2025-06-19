import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters'
import { activeFonts, colors, fontSizes } from "../styles";

export const SearchInputContainer = styled.View`
  z-index: 1;
  width: 95%;
  padding: ${moderateScale(10)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(120)}px;
  background-color: ${colors.themeWhite};
`;

export const SearchResultContainer = styled.View`
  z-index: 10;
  margin-top: ${moderateScale(1)}px;
  height: ${moderateScale(45)}px;
  width: 100%;
  background-color: ${colors.themeWhite};
  border-width: ${moderateScale(1)}px;
  border-color: ${colors.neutralGrey};
  border-radius: ${moderateScale(15)}px;
  text-align: center;
  justify-content: center;
  list-style: none;
`;

export const SearchCard = styled.View`
  flex-direction: row;
  align-content: center;
`;

export const CardIconContainer = styled.View`
  height: ${moderateScale(45)}px;
  justify-content: center;
  align-content: center;
`;

export const CardIcon = styled.Image`
  height: ${moderateScale(20)}px;
  width: ${moderateScale(20)}px;
  padding-left: ${moderateScale(20)}px;
  margin-right: ${moderateScale(10)}px;
  margin-top: ${moderateScale(2)}px;
`;

export const LabelContainer = styled.View`
  height: ${moderateScale(45)}px;
  width: 80%;
  justify-content: center;
`;

export const SearchResultText = styled.Text`
  width: 86%;
  font-family: ${activeFonts.Medium};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  text-align: left;
  color: ${colors.themeBlack};
`;



