import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Image } from "expo-image";

import { colors, fontSizes, activeFonts } from "../../styles";
import { Platform } from "react-native";

export const StyledImage = styled(Image)`
  width: ${moderateScale(40)}px;
  height: ${moderateScale(40)}px;
  border-radius: ${moderateScale(40)}px;
  resize-mode: cover;
`;

export const StyledIcon = styled.View`
  background-color: ${colors.lighterBlue};
  width: ${moderateScale(40)}px;
  height: ${moderateScale(40)}px;
  border-radius: ${moderateScale(40)}px;
  align-items: center;
  justify-content: center; 
`;

export const Card = styled.View`
  border-color: ${colors.border};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(12)}px;
  margin-bottom: ${moderateScale(16)}px;
  padding: ${moderateScale(15)}px;
  background-color: #ffffff;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 0px;
      shadow-opacity: 0.04;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 0;
    `,
  })}
`;

export const Header = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${moderateScale(12)}px;
  height: ${moderateScale(40)}px;
`;

export const UserInfo = styled.View`
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: ${moderateScale(4)}px;
  align-items: flex-start;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: ${moderateScale(fontSizes.Base)}px;
  font-family: ${activeFonts.Semibold};
  text-wrap: pretty;
`;

export const Date = styled.Text`
  font-size: ${moderateScale(fontSizes.XSmall)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.themeBlack};
`;

export const Actions = styled.View`
  justify-content: space-between;
  align-items: center;
`;

export const Description = styled.View`
   flex-direction: column;
   width: 100%;
`;

export const DescriptionTextCollapsed = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular};
  flex-wrap: wrap;
  width: 90%;
  margin-top: ${moderateScale(10)}px;
`;

export const DescriptionTextExpanded = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular};
  flex-wrap: wrap;
  width: 90%;
  margin-top: ${moderateScale(10)}px;
`;

export const ShowMoreText = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
  text-decoration: underline;
  text-decoration-color: ${colors.darkGrey};
  margin-top: ${moderateScale(10)}px;
`;

export const LabelsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: ${moderateScale(6)}px;
  margin-top: ${moderateScale(20)}px;
  width: 100%;
`;

export const TagWrapper = styled.View`
  background-color: ${colors.lighterBlue};
  border-radius: ${moderateScale(7)}px;
  justify-content: center;
  align-items: center;
  padding-vertical: ${moderateScale(5)}px;
  padding-horizontal: ${moderateScale(10)}px;
`;

export const TagText = styled.Text`
  font-size: ${moderateScale(fontSizes.XSmall)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.primaryBlue};
`;
